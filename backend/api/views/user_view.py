from django.utils import timezone
from rest_framework import generics

from ..models import User
from ..serializers import UserSerializer

class UserView(generics.RetrieveUpdateDestroyAPIView  ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
