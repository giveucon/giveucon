from django.db import models
from .product import Product
from .user import User

class FavoriteProduct(models.Model):
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    class Meta:
        unique_together = ('product', 'user')

