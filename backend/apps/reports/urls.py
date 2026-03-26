from django.urls import path

from .views import SalesReportView

urlpatterns = [
    path('reports/sales/', SalesReportView.as_view(), name='sales-report'),
]
