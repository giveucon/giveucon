from rest_framework.serializers import ModelSerializer
from . import ArticleSerializer
from ..models import Article, CentralNotice
from django.conf import settings

class CentralNoticeSerializer(ModelSerializer):
    article = ArticleSerializer()
    class Meta:
        model = CentralNotice
        fields = '__all__'
    def create(self, validated_data):
        article_data = validated_data.pop('article')
        user = validated_data.pop('user')
        article = Article.objects.create(user=user, **article_data)
        central_notice = CentralNotice.objects.create(article=article, **validated_data)
        return central_notice
