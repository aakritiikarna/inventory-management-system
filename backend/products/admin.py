"""
products/admin.py
"""

from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "sku",
        "name",
        "category",
        "supplier",
        "cost_price",
        "selling_price",
        "is_active",
    )
    list_filter = ("category", "supplier", "is_active")
    search_fields = ("sku", "name", "barcode")
