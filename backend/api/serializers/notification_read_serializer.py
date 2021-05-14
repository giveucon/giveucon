from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import Notification

class NotificationReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = Notification
        fields = '__all__'
