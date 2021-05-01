from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import Article, Review

class ReviewSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        with transaction.atomic():
            article = Article.objects.create(user=user, **article_data)
            review = Review.objects.create(article=article, **validated_data)
        return review
