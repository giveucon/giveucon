from django.db import transaction
from rest_framework import serializers

from .article_read_serializer import ArticleReadSerializer
from .article_write_serializer import ArticleWriteSerializer
from .image_serializer import ImageSerializer
from ..models import Article
from ..services import ImageService

class DummyArticleWriteSerializer(ArticleWriteSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Article
        fields = '__all__'
