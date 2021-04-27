from django.db import transaction
from rest_framework import serializers

from .image_serializer import ImageSerializer
from ..models import Article, Image

class ArticleReadSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True)
    class Meta:
        model = Article
        fields = '__all__'
