from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response

from ..models import User

from ..models import AccountUser
from ..serializers import UserSerializer

class DummyUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

