"""
products/models.py
"""

from django.core.validators import MinValueValidator
from django.db import models

from suppliers.models import Supplier


class Category(models.Model):
    """
    Separate Category model (rather than a plain CharField) so
    categories can be managed independently and reused/renamed without
    touching every product row.
    """

    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "products_category"
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    sku = models.CharField(max_length=64, unique=True, help_text="Stock Keeping Unit, unique per product.")
    name = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products"
    )
    description = models.TextField(blank=True, null=True)
    cost_price = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(0)]
    )
    selling_price = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(0)]
    )
    supplier = models.ForeignKey(
        Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name="products"
    )
    barcode = models.CharField(max_length=64, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products_product"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["sku"]),
            models.Index(fields=["barcode"]),
        ]

    def __str__(self):
        return f"{self.sku} - {self.name}"

    @property
    def margin(self):
        """Profit margin per unit, used by reports/inventory value calcs."""
        return self.selling_price - self.cost_price
