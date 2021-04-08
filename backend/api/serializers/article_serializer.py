from rest_framework.serializers import ModelSerializer
from ..models import Article
from django.conf import settings

class ArticleSerializer(ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ('user',)
