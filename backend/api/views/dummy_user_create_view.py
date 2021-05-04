from rest_framework import generics

from ..models import User
from ..serializers import DummyUserCreateSerializer

class DummyUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = DummyUserCreateSerializer
