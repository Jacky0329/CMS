from axes.models import AccessAttempt
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['branch_id'] = self.user.branch_id
        data['branch_name'] = self.user.branch.name if self.user.branch else None
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    is_locked = serializers.SerializerMethodField()
    branch_name = serializers.CharField(source='branch.name', read_only=True, default=None)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'role', 'branch', 'branch_name',
            'is_active', 'is_locked', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'is_active', 'is_locked', 'created_at', 'updated_at']

    def get_is_locked(self, obj):
        return AccessAttempt.objects.filter(username=obj.username).exists()

    def validate(self, attrs):
        role = attrs.get('role', getattr(self.instance, 'role', None))
        branch = attrs.get('branch', getattr(self.instance, 'branch', None))
        if role == 'sales' and branch is None:
            raise serializers.ValidationError({'branch': 'Branch is required for Sales users.'})
        if role == 'admin' and branch is not None:
            raise serializers.ValidationError({'branch': 'Admin users must not have a branch.'})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
