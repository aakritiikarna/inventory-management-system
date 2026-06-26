"""
warehouses/models.py
"""

from django.conf import settings
from django.db import models


class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(
        help_text="Maximum storage capacity of this warehouse (units)."
    )
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_warehouses",
        help_text="The Warehouse Manager responsible for this location.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "warehouses_warehouse"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.location})"

    @property
    def current_utilization(self):
        """
        Total units currently stocked across all stock records tied to
        this warehouse. Used by reports/dashboard to compute % capacity
        used. Avoids a circular import by referencing the related name
        from stock.models.StockItem at call time.
        """
        total = self.stock_items.aggregate(
            total=models.Sum("current_stock")
        )["total"]
        return total or 0
