from django.utils import timezone
from rest_framework import generics

from ..models import Article
from ..serializers import ArticleSerializer

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
