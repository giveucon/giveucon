from django.db import transaction
from rest_framework import serializers

from .article_read_serializer import ArticleReadSerializer
from .image_serializer import ImageSerializer
from ..models import Article
from ..services import ImageService

class ArticleWriteSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        with transaction.atomic():
            images = ImageService.save_images(images_data)
            article = Article.objects.create(**validated_data)
            article.images.set(images)
        return article

    def update(self, instance, validated_data):
        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images', []))
            instance.title = validated_data.pop('title', instance.title)
            instance.content = validated_data.pop('content', instance.title)
            instance.save()
            instance.images.all().delete()
            instance.images.set(images)
        return instance

    def to_representation(self, instance):
        return ArticleReadSerializer(instance).data
