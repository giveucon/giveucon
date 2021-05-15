from django.db import models
from django.utils import timezone
from .store import Store
from .image import Image

class Product(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=False)
    price = models.PositiveIntegerField(null=False)
    duration = models.DurationField(null=False, default=timezone.timedelta(days=365))
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    images = models.ManyToManyField(Image, blank=True)
    class Meta:
        unique_together = ('name', 'store')
    def __str__(self):
        return f"[{self.id}] {self.name}"
