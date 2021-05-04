from django.db import transaction
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .article_write_serializer import ArticleWriteSerializer
from .central_notice_read_serializer import CentralNoticeReadSerializer
from ..models import Article, CentralNotice

class DummyCentralNoticeCreateSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = CentralNotice
        fields = ['__all__']
        
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            central_notice = CentralNotice.objects.create(article=article, **validated_data)
        return central_notice

    def to_representation(self, instance):
        return CentralNoticeReadSerializer(instance).data
