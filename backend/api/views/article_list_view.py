from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import Article
from ..serializers import ArticleReadSerializer
from ..serializers import ArticleWriteSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class ArticleListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class_read = ArticleReadSerializer
    serializer_class_write = ArticleWriteSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        #images = self.request.data.getlist('images')
        #serializer.save(user=user, images=images)
        serializer.save(user=user)
