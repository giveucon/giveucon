from rest_framework import generics

from ..models import Article
from ..serializers import ArticleReadSerializer

class ArticleDetailView(generics.RetrieveUpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleReadSerializer
