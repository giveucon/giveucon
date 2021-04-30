from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .review_read_serializer import ReviewReadSerializer
from ..models import Review

class ReviewWriteSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            review = Review.objects.create(article=article, **validated_data)
        return review

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.score = validated_data.pop('score', instance.score)
            instance.save()
            article_data = validated_data.pop('article')
            article = ArticleWriteSerializer(instance.article, data=article_data, partial=True)
            article.is_valid(raise_exception=True)
            article.save()
        return instance

    def to_representation(self, instance):
        return ReviewReadSerializer(instance).data
