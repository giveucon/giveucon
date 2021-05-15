from django.db import models

class UserLocation(models.Model):
    user = models.OneToOneField(
        'User',
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    location = models.OneToOneField(
        'Location',
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
