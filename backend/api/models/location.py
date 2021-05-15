from django.db import models

class Location(models.Model):
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
