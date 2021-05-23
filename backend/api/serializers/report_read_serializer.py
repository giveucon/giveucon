from rest_framework.serializers import ModelSerializer

from .article_read_serializer import ArticleReadSerializer
from ..models import Report

class ReportReadSerializer(ModelSerializer):
    article = ArticleReadSerializer()
    class Meta:
        model = Report
        fields = '__all__'
