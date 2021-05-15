from django.db import models
from .article import Article
from .store import Store

class StoreNotice(models.Model):
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    class Meta:
        unique_together = ('article', 'store')

