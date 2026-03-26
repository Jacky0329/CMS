from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BrandViewSet, CarModelViewSet, ItemViewSet, PackageViewSet

router = DefaultRouter()
router.register('brands', BrandViewSet, basename='brand')
router.register('car-models', CarModelViewSet, basename='carmodel')
router.register('packages', PackageViewSet, basename='package')
router.register('items', ItemViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls)),
]
