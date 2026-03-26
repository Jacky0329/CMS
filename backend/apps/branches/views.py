from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin
from apps.core.mixins import EnvelopeModelViewSet
from .models import Branch
from .serializers import BranchSerializer


class BranchViewSet(EnvelopeModelViewSet):
    serializer_class = BranchSerializer
    queryset = Branch.objects.all().order_by('id')
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        return [IsAdmin()]

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        branch = self.get_object()
        branch.is_active = False
        branch.save(update_fields=['is_active'])
        return Response(BranchSerializer(branch).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        branch = self.get_object()
        branch.is_active = True
        branch.save(update_fields=['is_active'])
        return Response(BranchSerializer(branch).data)
