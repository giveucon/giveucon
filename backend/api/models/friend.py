from django.db import models
from .user import User

class Friend(models.Model):
    from_user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s_from'
    )
    to_user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s_to'
    )
    class Meta:
        unique_together = ('from_user', 'to_user')
