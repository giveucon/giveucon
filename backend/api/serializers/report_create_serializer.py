from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .article_write_serializer import ArticleWriteSerializer
from .report_read_serializer import ReportReadSerializer
from ..models import Report

class ReportCreateSerializer(ModelSerializer):
    article = ArticleWriteSerializer()
    class Meta:
        model = Report
        fields = '__all__'
        
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = ArticleWriteSerializer(data=article_data)
        article.is_valid(raise_exception=True)
        with transaction.atomic():
            article = article.save(user=user)
            report = Report.objects.create(article=article, **validated_data)
        return report

    def to_representation(self, instance):
        return ReportReadSerializer(instance).data
