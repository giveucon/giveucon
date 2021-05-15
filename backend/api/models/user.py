from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from .user_location import UserLocation

class User(models.Model):
    email = models.CharField(max_length=255, blank=False, null=False, unique=True)
    phone_number = PhoneNumberField(blank=False, null=False, unique=True)
    user_name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    first_name = models.CharField(max_length=255, blank=False, null=False)
    last_name = models.CharField(max_length=255, blank=False, null=False)
    locale = models.CharField(max_length=2, blank=False, null=False, default='ko')
    dark_mode = models.BooleanField(default=False)
    staff = models.BooleanField(default=False)
    location = models.OneToOneField(
        'UserLocation',
        null=True,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    def __str__(self):
        return f"[{self.id}] {self.user_name}"
