from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .notification_read_serializer import NotificationReadSerializer
from ..models import Notification

class NotificationCreateSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = Notification
        fields = '__all__'
        
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            notification = Notification.objects.create(article=article, **validated_data)
        return notification

    def to_representation(self, instance):
        return NotificationReadSerializer(instance).data
