from django.utils import timezone
from rest_framework import generics

from ..models import User
from ..serializers import UserSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
#    def create(self, request, *args, **kwargs):
