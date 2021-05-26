from django.core.validators import MinValueValidator
from django.db import models
from .stamp import Stamp

class StampSelling(models.Model):
    price = models.FloatField(null=False, validators=[MinValueValidator(0)])
    stamp = models.OneToOneField(
        Stamp,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
