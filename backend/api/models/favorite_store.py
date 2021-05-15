from django.db import models
from .store import Store
from .user import User

class FavoriteStore(models.Model):
    store = models.ForeignKey(
        Store,
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
        unique_together = ('store', 'user')

