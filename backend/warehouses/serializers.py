"""
warehouses/serializers.py
"""

from rest_framework import serializers

from accounts.models import User
from .models import Warehouse


class WarehouseSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Warehouse
        fields = [
            "id",
            "name",
            "location",
            "capacity",
            "manager",
            "manager_name",
            "current_utilization",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "current_utilization", "created_at", "updated_at"]

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.get_full_name() or obj.manager.username
        return None

    def validate_manager(self, value):
        if value and value.role not in (User.Role.ADMIN, User.Role.WAREHOUSE_MANAGER):
            raise serializers.ValidationError(
                "Only users with Admin or Warehouse Manager role can be assigned as a warehouse manager."
            )
        return value
