from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import Review

class ReviewReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = Review
        fields = '__all__'
