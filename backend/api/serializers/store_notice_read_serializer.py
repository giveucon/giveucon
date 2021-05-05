from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from .store_read_serializer import StoreReadSerializer
from ..models import StoreNotice

class StoreNoticeReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    store = StoreReadSerializer()
    class Meta:
        model = StoreNotice
        fields = '__all__'
