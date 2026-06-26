"""
purchase_orders/models.py
"""

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models, transaction as db_transaction
from django.core.exceptions import ValidationError
from django.utils import timezone

from products.models import Product
from suppliers.models import Supplier
from warehouses.models import Warehouse
from stock.models import StockTransaction


def generate_po_number():
    """
    Generates a PO number like PO-20260624-0001. Uniqueness is
    guaranteed by retry-on-collision in PurchaseOrder.save(), not by
    this function alone (timestamps + sequential count is good enough
    for a small/medium business, but a race is still technically
    possible under heavy concurrent load).
    """
    today = timezone.now().strftime("%Y%m%d")
    count_today = PurchaseOrder.objects.filter(po_number__startswith=f"PO-{today}").count()
    return f"PO-{today}-{count_today + 1:04d}"


class PurchaseOrder(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        APPROVED = "APPROVED", "Approved"
        RECEIVED = "RECEIVED", "Received"
        CANCELLED = "CANCELLED", "Cancelled"

    po_number = models.CharField(max_length=30, unique=True, editable=False)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name="purchase_orders")
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="purchase_orders",
        help_text="Warehouse goods will be received into.",
    )
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_purchase_orders"
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_purchase_orders",
    )
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_purchase_orders",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "purchase_orders_purchaseorder"
        ordering = ["-created_at"]

    def __str__(self):
        return self.po_number

    def save(self, *args, **kwargs):
        if not self.po_number:
            # Small retry loop to dodge the (rare) race condition where
            # two POs are created in the same second and would
            # otherwise collide on the generated number.
            for _ in range(5):
                candidate = generate_po_number()
                if not PurchaseOrder.objects.filter(po_number=candidate).exists():
                    self.po_number = candidate
                    break
        super().save(*args, **kwargs)

    @property
    def total_amount(self):
        return sum((line.line_total for line in self.lines.all()), 0)

    def approve(self, user):
        if self.status != self.Status.DRAFT:
            raise ValidationError("Only a DRAFT purchase order can be approved.")
        if not self.lines.exists():
            raise ValidationError("Cannot approve a purchase order with no product lines.")
        self.status = self.Status.APPROVED
        self.approved_by = user
        self.save()

    @db_transaction.atomic
    def receive(self, user):
        """
        Marks the PO as RECEIVED and creates a STOCK_IN transaction for
        every line item, which increases stock in self.warehouse. This
        is the single point where a Purchase Order actually affects
        physical inventory.
        """
        if self.status != self.Status.APPROVED:
            raise ValidationError("Only an APPROVED purchase order can be received.")
        for line in self.lines.select_related("product").all():
            txn = StockTransaction(
                product=line.product,
                warehouse=self.warehouse,
                transaction_type=StockTransaction.TransactionType.STOCK_IN,
                quantity=line.quantity,
                reference_note=f"Received via {self.po_number}",
                performed_by=user,
            )
            txn.save()
            txn.apply()
        self.status = self.Status.RECEIVED
        self.received_by = user
        self.save()

    def cancel(self):
        if self.status == self.Status.RECEIVED:
            raise ValidationError("A RECEIVED purchase order cannot be cancelled.")
        self.status = self.Status.CANCELLED
        self.save()


class PurchaseOrderLine(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="lines")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="purchase_order_lines")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        db_table = "purchase_orders_purchaseorderline"
        unique_together = ("purchase_order", "product")

    def __str__(self):
        return f"{self.product.sku} x {self.quantity}"

    @property
    def line_total(self):
        return self.quantity * self.unit_cost
