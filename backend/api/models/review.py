from django.db import models
from .article import Article

class Review(models.Model):
    score = models.PositiveIntegerField(null=False) # 1~5
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s'
    )
    def __str__(self):
        return f"[{self.id}] {self.article.title}"
