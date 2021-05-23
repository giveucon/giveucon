from django.db import models
from .article import Article
from .user import User

class Report(models.Model):
    article = models.OneToOneField(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    to_user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    def __str__(self):
        return f"[{self.id}] {self.article.title}"
