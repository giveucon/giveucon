from django.db import models
from .user import User
from .menu_item import MenuItem

class UserMenuItem(models.Model):
    order = models.PositiveIntegerField(null=False)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    menu_item = models.ForeignKey(
        MenuItem,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    class Meta:
        unique_together = ('user', 'menu_item')

