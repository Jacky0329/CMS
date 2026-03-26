from django.conf import settings
from django.db import models


class Customer(models.Model):
    full_name = models.CharField(max_length=200)
    car_plate = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.car_plate})"


class Quotation(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    branch = models.ForeignKey(
        'branches.Branch', on_delete=models.PROTECT, related_name='quotations'
    )
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name='quotations'
    )
    car_model = models.ForeignKey(
        'catalog.CarModel', on_delete=models.PROTECT, related_name='quotations'
    )
    package = models.ForeignKey(
        'catalog.Package', on_delete=models.PROTECT, related_name='quotations'
    )
    sales_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='quotations'
    )
    snapshot_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'branch']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"Quotation #{self.pk} - {self.status}"
