from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CustomerViewSet, QuotationViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet, basename='customer')
router.register('quotations', QuotationViewSet, basename='quotation')

urlpatterns = [
    path('', include(router.urls)),
]
