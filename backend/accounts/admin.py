"""
accounts/admin.py
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Extends Django's built-in UserAdmin to surface our custom fields
    (role, phone_number, employee_id, is_active_employee) in the
    Django admin site.
    """

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_active_employee",
        "is_staff",
        "date_joined",
    )
    list_filter = ("role", "is_active_employee", "is_staff", "is_superuser")
    search_fields = ("username", "email", "first_name", "last_name", "employee_id")
    ordering = ("-date_joined",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "Inventory System Role & Profile",
            {
                "fields": (
                    "role",
                    "phone_number",
                    "employee_id",
                    "profile_picture",
                    "is_active_employee",
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Inventory System Role & Profile",
            {"fields": ("role", "phone_number", "employee_id")},
        ),
    )
