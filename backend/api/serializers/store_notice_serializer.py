from django.conf import settings
from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_serializer import ArticleSerializer
from ..models import Article, StoreNotice

class StoreNoticeSerializer(ModelSerializer):
    article = ArticleSerializer()
    class Meta:
        model = StoreNotice
        fields = '__all__'
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        with transaction.atomic():
            article = Article.objects.create(user=user, **article_data)
            store_notice = StoreNotice.objects.create(article=article, **validated_data)
        return store_notice
