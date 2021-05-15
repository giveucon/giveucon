from django.db import models
from .account import Account
from .user import User

class AccountUser(models.Model):
    account = models.OneToOneField(
        Account,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    user = models.OneToOneField(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )

