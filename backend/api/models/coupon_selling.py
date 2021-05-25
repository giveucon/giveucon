from django.db import models
from .coupon import Coupon
from .coupon_selling_status import CouponSellingStatus

class CouponSelling(models.Model):
    price = models.PositiveIntegerField(null=False)
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
