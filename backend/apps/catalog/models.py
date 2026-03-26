from django.core.validators import MinValueValidator
from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='car_models')
    name = models.CharField(max_length=100)
    year = models.PositiveSmallIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('brand', 'name', 'year')

    def __str__(self):
        return f"{self.brand.name} {self.name} {self.year}"


class Package(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.PROTECT, related_name='packages')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('car_model', 'name')

    def __str__(self):
        return f"{self.car_model} - {self.name}"


class Item(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} x{self.quantity}"
