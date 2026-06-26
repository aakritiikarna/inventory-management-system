"""
reports/urls.py
"""

from django.urls import path

from .views import (
    DashboardSummaryView,
    InventoryValueView,
    MonthlyStockMovementView,
    PurchaseOrderReportView,
    PurchaseTrendsView,
    StockReportView,
    SupplierReportView,
    WarehouseReportView,
)

urlpatterns = [
    # Dashboard
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("dashboard/stock-movement/", MonthlyStockMovementView.as_view(), name="dashboard-stock-movement"),
    path("dashboard/purchase-trends/", PurchaseTrendsView.as_view(), name="dashboard-purchase-trends"),
    path("dashboard/inventory-value/", InventoryValueView.as_view(), name="dashboard-inventory-value"),
    # Reports (support ?format=csv|excel)
    path("stock/", StockReportView.as_view(), name="report-stock"),
    path("suppliers/", SupplierReportView.as_view(), name="report-suppliers"),
    path("warehouses/", WarehouseReportView.as_view(), name="report-warehouses"),
    path("purchase-orders/", PurchaseOrderReportView.as_view(), name="report-purchase-orders"),
]
