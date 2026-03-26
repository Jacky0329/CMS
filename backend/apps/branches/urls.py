from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BranchViewSet

router = DefaultRouter()
router.register(r'branches', BranchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
