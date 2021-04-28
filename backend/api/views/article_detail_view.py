from rest_framework import generics

from ..models import Article
from ..serializers import ArticleReadSerializer
from ..serializers import ArticleWriteSerializer
from ..mixins import SerializerMixin

class ArticleDetailView(SerializerMixin, generics.RetrieveUpdateAPIView):
    queryset = Article.objects.all()
    serializer_class_read = ArticleReadSerializer
    serializer_class_write = ArticleWriteSerializer
