from django.db import models
from django.utils import timezone
from .user import User
from .product import Product

class Coupon(models.Model):
    signature = models.CharField(max_length=64, blank=False, null=True, unique=True)
    otp_key = models.CharField(max_length=16, blank=False, null=False, unique=True)
    created_at = models.DateTimeField(null=False, editable=False, default=timezone.now)
    used = models.BooleanField(default=False)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    def __str__(self):
        return f"[{self.id}] Coupon of {self.product.name}"

