from django.db import models
from .store import Store
from .review import Review

class StoreReview(models.Model):
    store = models.ForeignKey(
        Store,
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
        unique_together = ('store', 'review')

