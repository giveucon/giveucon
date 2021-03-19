from django.conf import settings
from django.db import models
from django.utils import timezone

class Article(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    image = models.ImageField()
    content = models.TextField(blank=True, null=False)
    at = models.DateTimeField(blank=False, null=False, default=timezone.now, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.CASCADE
    )
