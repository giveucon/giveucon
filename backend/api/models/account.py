from django.db import models
from django.contrib.auth.models import AbstractUser

class Account(AbstractUser):
    class Meta:
        verbose_name = 'account'
        verbose_name_plural = 'accounts'
    def __str__(self):
        return f"[{self.id}] {self.username}"
