from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .store_notice_read_serializer import StoreNoticeReadSerializer
from ..models import StoreNotice

class DummyStoreNoticeCreateSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = StoreNotice
        fields = '__all__'

    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            store_notice = StoreNotice.objects.create(article=article, **validated_data)
        return store_notice

    def to_representation(self, instance):
        return StoreNoticeReadSerializer(instance).data
