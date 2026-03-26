from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.permissions import IsAdmin, IsSales
from apps.core.mixins import EnvelopeModelViewSet
from .models import Brand, CarModel, Item, Package
from .serializers import BrandSerializer, CarModelSerializer, ItemSerializer, PackageSerializer


class BrandViewSet(EnvelopeModelViewSet):
    serializer_class = BrandSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        if getattr(self.request.user, 'role', None) == 'sales':
            return Brand.objects.filter(is_active=True)
        return Brand.objects.all().order_by('id')

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'deactivate', 'activate']:
            return [IsAdmin()]
        return [(IsAdmin | IsSales)()]

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        brand = self.get_object()
        brand.is_active = False
        brand.save(update_fields=['is_active'])
        return Response(BrandSerializer(brand).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        brand = self.get_object()
        brand.is_active = True
        brand.save(update_fields=['is_active'])
        return Response(BrandSerializer(brand).data)


class CarModelViewSet(EnvelopeModelViewSet):
    serializer_class = CarModelSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        qs = CarModel.objects.select_related('brand')
        if getattr(self.request.user, 'role', None) == 'sales':
            qs = qs.filter(is_active=True)
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            qs = qs.filter(brand_id=brand_id)
        return qs

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'deactivate', 'activate']:
            return [IsAdmin()]
        return [(IsAdmin | IsSales)()]

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        car_model = self.get_object()
        car_model.is_active = False
        car_model.save(update_fields=['is_active'])
        return Response(CarModelSerializer(car_model).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        car_model = self.get_object()
        car_model.is_active = True
        car_model.save(update_fields=['is_active'])
        return Response(CarModelSerializer(car_model).data)


class PackageViewSet(EnvelopeModelViewSet):
    serializer_class = PackageSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        qs = Package.objects.select_related('car_model').prefetch_related('items')
        if getattr(self.request.user, 'role', None) == 'sales':
            qs = qs.filter(is_active=True)
        car_model_id = self.request.query_params.get('car_model')
        if car_model_id:
            qs = qs.filter(car_model_id=car_model_id)
        return qs

    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'deactivate', 'activate']:
            return [IsAdmin()]
        return [(IsAdmin | IsSales)()]

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        package = self.get_object()
        package.is_active = False
        package.save(update_fields=['is_active'])
        return Response(PackageSerializer(package).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        package = self.get_object()
        package.is_active = True
        package.save(update_fields=['is_active'])
        return Response(PackageSerializer(package).data)


class ItemViewSet(EnvelopeModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        qs = Item.objects.all()
        package_id = self.request.query_params.get('package')
        if package_id:
            qs = qs.filter(package_id=package_id)
        return qs

    def get_permissions(self):
        return [IsAdmin()]
