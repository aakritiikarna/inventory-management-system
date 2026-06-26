"""
suppliers/admin.py
"""

from django.contrib import admin

from .models import Supplier


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("name", "contact_person", "email", "phone", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "contact_person", "email", "phone")
    ordering = ("name",)
