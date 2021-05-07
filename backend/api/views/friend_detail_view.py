from rest_framework import generics

from ..models import Friend
from ..serializers import FriendReadSerializer
from ..serializers import FriendWriteSerializer

class FriendDetailView(generics.RetrieveDestroyAPIView):
    queryset = Friend.objects.all()
    serializer_class = FriendReadSerializer
