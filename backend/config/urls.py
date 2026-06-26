"""
config/urls.py

Root URL configuration. Mounts every app under /api/<app>/.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/suppliers/", include("suppliers.urls")),
    path("api/warehouses/", include("warehouses.urls")),
    path("api/products/", include("products.urls")),
    path("api/stock/", include("stock.urls")),
    path("api/purchase-orders/", include("purchase_orders.urls")),
    path("api/reports/", include("reports.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
