import re

from rest_framework import serializers

from apps.catalog.serializers import CarModelSerializer, PackageSerializer
from .models import Customer, Quotation


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'full_name', 'car_plate', 'phone_number', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_phone_number(self, value):
        digits = re.sub(r'[^\d]', '', value)
        if len(digits) < 10 or len(digits) > 15:
            raise serializers.ValidationError('Enter a valid phone number.')
        if not re.match(r'^[+\d][\d\s\-]+$', value):
            raise serializers.ValidationError('Enter a valid phone number.')
        return value

    def validate_car_plate(self, value):
        if self.instance and self.instance.car_plate != value:
            raise serializers.ValidationError('Car plate cannot be changed after creation.')
        return value


class QuotationReadSerializer(serializers.ModelSerializer):
    branch = serializers.SerializerMethodField()
    customer = CustomerSerializer(read_only=True)
    car_model = CarModelSerializer(read_only=True)
    package = serializers.SerializerMethodField()
    sales_user = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = [
            'id', 'branch', 'customer', 'car_model', 'package',
            'sales_user', 'snapshot_price', 'status', 'created_at', 'updated_at',
        ]

    def get_branch(self, obj):
        return {'id': obj.branch_id, 'name': obj.branch.name}

    def get_package(self, obj):
        return {'id': obj.package_id, 'name': obj.package.name}

    def get_sales_user(self, obj):
        return {'id': obj.sales_user_id, 'username': obj.sales_user.username}


class QuotationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = ['id', 'customer', 'car_model', 'package']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['branch'] = request.user.branch
        validated_data['sales_user'] = request.user
        validated_data['snapshot_price'] = validated_data['package'].price
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if instance.status != 'draft':
            raise serializers.ValidationError(
                {'status': ['Cannot edit a confirmed or cancelled quotation.']}
            )
        if 'package' in validated_data:
            validated_data['snapshot_price'] = validated_data['package'].price
        return super().update(instance, validated_data)
