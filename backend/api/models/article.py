from django.db import models
from django.utils import timezone
from .user import User
from .image import Image

class Article(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    content = models.TextField(blank=True, null=False)
    created_at = models.DateTimeField(null=False, editable=False, default=timezone.now)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    images = models.ManyToManyField(Image, blank=True)
    def __str__(self):
        return f"[{self.id}] {self.title}"
