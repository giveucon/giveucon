from django.db import models
from .user import User
from .product import Product

class Stamp(models.Model):
    max_count = models.PositiveIntegerField(null=False)
    count = models.PositiveIntegerField(null=False, default=0)
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

