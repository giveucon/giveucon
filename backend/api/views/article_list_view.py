from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import Article, AccountUser
from ..serializers import ArticleSerializer
from ..services import UserService

class ArticleListView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    def create(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data)
