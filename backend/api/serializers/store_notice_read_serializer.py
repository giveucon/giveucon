from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import StoreNotice

class StoreNoticeReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = StoreNotice
        fields = '__all__'
