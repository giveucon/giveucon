from django.db import transaction
from rest_framework import serializers

from .image_serializer import ImageSerializer
from ..models import Article, Image

class ArticleSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        user = validated_data.pop('user')
        images_data = validated_data.pop('images')
        with transaction.atomic():
            images = Image.objects.bulk_create([Image() for _ in images_data])
            for i in range(len(images)):
                images[i].image.save(images_data[i].name, images_data[i])
            article = Article.objects.create(user=user, **validated_data)
            article.images.set(images)
        return article
