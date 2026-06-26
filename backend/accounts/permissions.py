"""
accounts/permissions.py

Centralized Role Based Access Control (RBAC) permission classes.
These are imported by every app's views.py (products, suppliers,
warehouses, stock, purchase_orders, reports) so that role logic lives
in exactly one place instead of being duplicated/re-implemented per app.

Role hierarchy (most to least privileged):
    ADMIN > WAREHOUSE_MANAGER > STAFF

General policy used across the system:
- ADMIN: full read/write on everything, including user management.
- WAREHOUSE_MANAGER: full read/write on operational data (products,
  suppliers, warehouses, stock, purchase orders) but NOT user accounts.
- STAFF: read access everywhere, write access limited to stock
  transactions (stock in/out) needed for day-to-day work. Cannot
  create/delete master data (products, suppliers, warehouses) or
  approve purchase orders.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allows access only to users with the ADMIN role."""

    message = "Only Admin users are allowed to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_admin
        )


class IsWarehouseManager(BasePermission):
    """Allows access only to users with the WAREHOUSE_MANAGER role."""

    message = "Only Warehouse Managers are allowed to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_warehouse_manager
        )


class IsAdminOrWarehouseManager(BasePermission):
    """
    Allows access to Admins and Warehouse Managers. This is the most
    commonly used permission for write operations on operational data
    (products, suppliers, warehouses, purchase order approval, etc.)
    """

    message = "Only Admins or Warehouse Managers are allowed to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_admin or request.user.is_warehouse_manager)
        )


class IsStaffUser(BasePermission):
    """Allows access only to users with the STAFF role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff_role
        )


class ReadOnlyOrAdminWarehouseManager(BasePermission):
    """
    The standard permission for most ViewSets in this system:
    - Any authenticated user (Admin, Warehouse Manager, Staff) may
      perform safe/read-only methods (GET, HEAD, OPTIONS).
    - Only Admins and Warehouse Managers may create, update, or delete.

    This implements: 'Staff can view products/suppliers/warehouses but
    cannot create/delete master data.'
    """

    message = "You do not have permission to modify this resource."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_admin or request.user.is_warehouse_manager


class CanApprovePurchaseOrder(BasePermission):
    """
    Approving/receiving purchase orders is a financially sensitive
    operation, so it's restricted to Admins and Warehouse Managers
    only (never Staff), regardless of HTTP method.
    """

    message = "Only Admins or Warehouse Managers may approve or receive purchase orders."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_admin or request.user.is_warehouse_manager)
        )


class CanPerformStockTransaction(BasePermission):
    """
    Stock In / Stock Out / Adjustment / Transfer are core daily tasks
    that ALL authenticated roles (including Staff) are allowed to
    perform, since warehouse floor staff are typically the ones
    physically moving goods. Read access is open to everyone;
    write access (recording a transaction) requires authentication
    only (no STAFF restriction), but deleting a stock transaction
    record (audit-sensitive) is restricted further at the view level.
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method == "DELETE":
            return request.user.is_admin or request.user.is_warehouse_manager
        return True


class IsAdminOrSelf(BasePermission):
    """
    Used on user-profile-related endpoints: an Admin can act on any
    user account, while a non-admin user may only access/edit their
    own account (object-level check).
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.id == request.user.id
