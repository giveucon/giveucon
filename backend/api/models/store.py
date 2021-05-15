from django.db import models
from .user import User
from .image import Image
from .tag import Tag
from .store_location import StoreLocation

class Store(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)
    private_key = models.CharField(max_length=64, blank=False, null=False, unique=True)
    public_key = models.CharField(max_length=128, blank=False, null=False, unique=True)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    images = models.ManyToManyField(Image, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    location = models.OneToOneField(
        StoreLocation,
        null=True,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    def __str__(self):
        return f"[{self.id}] {self.name}"
