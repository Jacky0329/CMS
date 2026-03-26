from rest_framework import filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin, IsSales
from apps.core.mixins import EnvelopeModelViewSet
from .models import Customer, Quotation
from .serializers import CustomerSerializer, QuotationReadSerializer, QuotationWriteSerializer


class CustomerViewSet(EnvelopeModelViewSet):
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'car_plate']
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        return Customer.objects.all().order_by('id')

    def get_permissions(self):
        if self.action in ['create', 'partial_update']:
            return [IsSales()]
        return [(IsAdmin | IsSales)()]


class QuotationViewSet(EnvelopeModelViewSet):
    filter_backends = [filters.SearchFilter]
    search_fields = ['customer__full_name', 'customer__car_plate']
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_serializer_class(self):
        if self.action in ['create', 'partial_update']:
            return QuotationWriteSerializer
        return QuotationReadSerializer

    def get_queryset(self):
        qs = Quotation.objects.select_related(
            'branch', 'customer', 'car_model', 'car_model__brand', 'package', 'sales_user'
        )
        user = self.request.user
        if getattr(user, 'role', None) == 'sales':
            qs = qs.filter(branch=user.branch)
        else:
            branch_id = self.request.query_params.get('branch')
            if branch_id:
                qs = qs.filter(branch_id=branch_id)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        return qs.order_by('-created_at')

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'confirm', 'cancel']:
            return [IsSales()]
        return [(IsAdmin | IsSales)()]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        quotation = self.get_object()
        if quotation.status != 'draft':
            return Response(
                {'status': ['Invalid status transition.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        quotation.status = 'confirmed'
        quotation.save(update_fields=['status'])
        return Response(QuotationReadSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        quotation = self.get_object()
        if quotation.status != 'draft':
            return Response(
                {'status': ['Invalid status transition.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        quotation.status = 'cancelled'
        quotation.save(update_fields=['status'])
        return Response(QuotationReadSerializer(quotation).data)
