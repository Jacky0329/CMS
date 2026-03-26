from axes.models import AccessAttempt
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.permissions import IsAdmin
from apps.core.mixins import EnvelopeModelViewSet
from .models import User
from .serializers import CustomTokenObtainPairSerializer, UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(EnvelopeModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.select_related('branch').all()
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        return [IsAdmin()]

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=['is_active'])
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        user = self.get_object()
        deleted, _ = AccessAttempt.objects.filter(username=user.username).delete()
        return Response({'detail': f'Account unlocked. {deleted} attempt(s) cleared.'})
