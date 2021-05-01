from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import Article
from ..serializers import ArticleReadSerializer
from ..serializers import ArticleWriteSerializer
from ..services import UserService

class ArticleListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class_read = ArticleReadSerializer
    serializer_class_write = ArticleWriteSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
