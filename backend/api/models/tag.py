from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    def __str__(self):
        return f"[{self.id}] {self.name}"

