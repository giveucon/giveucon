from django.db import models
from .product import Product
from .review import Review

class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    review = models.ForeignKey(
        Review,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    class Meta:
        unique_together = ('product', 'review')

