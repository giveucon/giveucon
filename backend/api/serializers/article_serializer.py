from django.conf import settings
from django.db import transaction
from rest_framework.serializers import ModelSerializer
from .image_serializer import ImageSerializer
from ..models import Article

class ArticleSerializer(ModelSerializer):
    images = ImageSerializer(many=True, required=False)
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        print(validated_data)
        if 'images' in validated_data:
            images_data = validated_data.pop('images')
            print(images_data)
        user = validated_data.pop('user')
        with transaction.atomic():
            images = []
            article = Article.objects.create(user=user, **validated_data)
            for image in images:
                article.images.add(image)
        return article
