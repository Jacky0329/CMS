from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to users with role='admin'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsSales(BasePermission):
    """Allow access only to users with role='sales'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'sales'
        )
