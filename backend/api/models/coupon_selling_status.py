from django.db import models

class CouponSellingStatus(models.Model):
    status = models.CharField(max_length=255, blank=False, null=False, unique=True)
