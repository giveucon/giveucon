from django.db import models

class StoreLocation(models.Model):
    store = models.OneToOneField(
        'Store',
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
