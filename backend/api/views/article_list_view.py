from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import Article, AccountUser
from ..serializers import ArticleSerializer
from ..services import UserService

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        images = self.request.data.getlist('images')
        serializer.save(user=user, images=images)
