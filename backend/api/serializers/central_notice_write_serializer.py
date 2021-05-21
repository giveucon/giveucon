from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .central_notice_read_serializer import CentralNoticeReadSerializer
from ..models import CentralNotice

class CentralNoticeWriteSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = CentralNotice
        fields = '__all__'
        
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = None
        if 'user' in validated_data:
            user = validated_data.pop('user')
        elif 'user' in article_data:
            user = article_data.pop('user')
        assert(user is not None)
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
