from rest_framework import serializers

from .models import Brand, CarModel, Item, Package


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class CarModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = CarModel
        fields = ['id', 'brand', 'brand_name', 'name', 'year', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'package', 'name', 'quantity', 'unit_price', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PackageSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = ['id', 'car_model', 'name', 'description', 'price', 'is_active', 'items', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
