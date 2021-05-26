from django.core.validators import MinValueValidator
from django.db import models
from .coupon import Coupon
from .coupon_selling_status import CouponSellingStatus
from .user import User

class CouponSelling(models.Model):
    price = models.FloatField(null=False, validators=[MinValueValidator(0)])
    coupon = models.OneToOneField(
        Coupon,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    status = models.ForeignKey(
        CouponSellingStatus,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    buyer = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
