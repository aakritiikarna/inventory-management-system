"""
stock/models.py

Two core models:

1. StockItem - the current quantity snapshot of a Product inside a
   specific Warehouse (current / reserved / available / minimum level).
   This is what powers "available stock" checks and low-stock alerts.

2. StockTransaction - an immutable audit log of every movement
   (Stock In, Stock Out, Adjustment, Transfer) that ever changed a
   StockItem's quantity. This is what the Dashboard's "Monthly Stock
   Movement" chart and the Stock Report are built from.
"""

from django.conf import settings
from django.db import models, transaction
from django.core.exceptions import ValidationError

from products.models import Product
from warehouses.models import Warehouse


class StockItem(models.Model):
    """
    Represents how much of a given Product is stored in a given
    Warehouse. One row per (product, warehouse) pair.
    """

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="stock_items")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="stock_items")

    current_stock = models.PositiveIntegerField(default=0)
    reserved_stock = models.PositiveIntegerField(
        default=0, help_text="Stock allocated to pending orders but not yet shipped."
    )
    minimum_stock_level = models.PositiveIntegerField(
        default=0, help_text="Reorder threshold. Below this triggers a low-stock alert."
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock_stockitem"
        unique_together = ("product", "warehouse")
        ordering = ["product__name"]

    def __str__(self):
        return f"{self.product.sku} @ {self.warehouse.name}: {self.current_stock}"

    @property
    def available_stock(self):
        """Stock that is physically present and not already reserved."""
        return max(self.current_stock - self.reserved_stock, 0)

    @property
    def is_low_stock(self):
        return self.current_stock <= self.minimum_stock_level


class StockTransaction(models.Model):
    """
    Immutable ledger entry for every stock movement. Rows are created
    by the StockTransactionSerializer/views and should never be
    edited after creation — only new correcting transactions should be
    added, to preserve a trustworthy audit trail.
    """

    class TransactionType(models.TextChoices):
        STOCK_IN = "STOCK_IN", "Stock In"
        STOCK_OUT = "STOCK_OUT", "Stock Out"
        ADJUSTMENT = "ADJUSTMENT", "Adjustment"
        TRANSFER = "TRANSFER", "Transfer"

    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="transactions")
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="transactions",
        help_text="Source warehouse for OUT/ADJUSTMENT/TRANSFER, or the receiving warehouse for IN.",
    )
    destination_warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="incoming_transfers",
        null=True,
        blank=True,
        help_text="Only set for TRANSFER transactions: the warehouse stock is moving to.",
    )
    transaction_type = models.CharField(max_length=12, choices=TransactionType.choices)
    quantity = models.PositiveIntegerField()
    # For ADJUSTMENT, quantity is the absolute new current_stock delta
    # represented as a signed adjustment via adjustment_delta below.
    adjustment_delta = models.IntegerField(
        null=True,
        blank=True,
        help_text="Signed change applied for ADJUSTMENT transactions (can be negative).",
    )
    reference_note = models.CharField(max_length=255, blank=True, null=True)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="stock_transactions"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_stocktransaction"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["transaction_type", "created_at"]),
        ]

    def __str__(self):
        return f"{self.transaction_type} - {self.product.sku} ({self.quantity})"

    @transaction.atomic
    def apply(self):
        """
        Applies this transaction's effect to the relevant StockItem
        row(s). Wrapped in a DB transaction + select_for_update so
        concurrent stock movements on the same product/warehouse can't
        race each other into an inconsistent quantity.
        """
        if self.transaction_type == self.TransactionType.STOCK_IN:
            item, _ = StockItem.objects.select_for_update().get_or_create(
                product=self.product, warehouse=self.warehouse
            )
            item.current_stock += self.quantity
            item.save()

        elif self.transaction_type == self.TransactionType.STOCK_OUT:
            item = StockItem.objects.select_for_update().get(
                product=self.product, warehouse=self.warehouse
            )
            if item.available_stock < self.quantity:
                raise ValidationError(
                    f"Insufficient available stock for {self.product.sku} at {self.warehouse.name}."
                )
            item.current_stock -= self.quantity
            item.save()

        elif self.transaction_type == self.TransactionType.ADJUSTMENT:
            item, _ = StockItem.objects.select_for_update().get_or_create(
                product=self.product, warehouse=self.warehouse
            )
            delta = self.adjustment_delta or 0
            new_value = item.current_stock + delta
            if new_value < 0:
                raise ValidationError("Adjustment would result in negative stock.")
            item.current_stock = new_value
            item.save()

        elif self.transaction_type == self.TransactionType.TRANSFER:
            if not self.destination_warehouse:
                raise ValidationError("Transfer requires a destination warehouse.")
            source_item = StockItem.objects.select_for_update().get(
                product=self.product, warehouse=self.warehouse
            )
            if source_item.available_stock < self.quantity:
                raise ValidationError(
                    f"Insufficient available stock for {self.product.sku} at {self.warehouse.name} to transfer."
                )
            source_item.current_stock -= self.quantity
            source_item.save()

            dest_item, _ = StockItem.objects.select_for_update().get_or_create(
                product=self.product, warehouse=self.destination_warehouse
            )
            dest_item.current_stock += self.quantity
            dest_item.save()
