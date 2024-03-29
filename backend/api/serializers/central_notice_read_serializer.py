from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import CentralNotice

class CentralNoticeReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = CentralNotice
        fields = '__all__'
