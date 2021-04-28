from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .central_notice_read_serializer import CentralNoticeReadSerializer
from ..models import Article, CentralNotice

class CentralNoticeWriteSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = CentralNotice
        fields = '__all__'
        
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            central_notice = CentralNotice.objects.create(article=article, **validated_data)
        return central_notice

    def update(self, instance, validated_data):
        article_data = validated_data.pop('article')
        article = ArticleWriteSerializer(instance.article, data=article_data, partial=True)
        article.is_valid(raise_exception=True)
        article.save()
        return instance

    def to_representation(self, instance):
        return CentralNoticeReadSerializer(instance).data
