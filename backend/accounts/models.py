"""
accounts/models.py

Defines the custom User model used across the entire system for
authentication and Role Based Access Control (RBAC).

Roles:
- ADMIN: Full access to all modules (users, suppliers, warehouses,
  products, stock, purchase orders, reports).
- WAREHOUSE_MANAGER: Can manage warehouses, stock, and approve/receive
  purchase orders, but cannot manage user accounts.
- STAFF: Can perform day-to-day operations (stock in/out, viewing
  products/suppliers) but cannot create/delete master data or approve
  purchase orders.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    We extend AbstractUser (instead of AbstractBaseUser) to keep all the
    built-in auth machinery (password hashing, permissions, groups, etc.)
    while adding the fields we need for RBAC and profile data.
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER", "Warehouse Manager"
        STAFF = "STAFF", "Staff"

    # Core RBAC field. Every permission check in the system keys off this.
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STAFF,
        help_text="Determines what the user is allowed to do across the system.",
    )

    # Extra profile fields.
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    employee_id = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        unique=False,
        help_text="Internal employee/staff ID, optional.",
    )
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", blank=True, null=True
    )
    is_active_employee = models.BooleanField(
        default=True,
        help_text="Set to False to disable a user without deleting their account.",
    )

    # Audit fields.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "accounts_user"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    # ---------------------------------------------------------------
    # Convenience helpers used throughout permissions.py and views.py
    # ---------------------------------------------------------------
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_warehouse_manager(self):
        return self.role == self.Role.WAREHOUSE_MANAGER

    @property
    def is_staff_role(self):
        """
        Named is_staff_role (not is_staff) to avoid clashing with
        Django's built-in AbstractUser.is_staff field (used for admin
        site access), which is unrelated to our business 'Staff' role.
        """
        return self.role == self.Role.STAFF
