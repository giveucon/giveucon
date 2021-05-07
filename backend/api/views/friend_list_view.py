from rest_framework import generics

from ..models import Friend
from ..mixins import SerializerMixin
from ..paginations import FriendPagination
from ..serializers import FriendReadSerializer
from ..serializers import FriendWriteSerializer
from ..services import UserService

class FriendListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Friend.objects.all()
    serializer_class_read = FriendReadSerializer
    serializer_class_write = FriendWriteSerializer
    pagination_class = FriendPagination
    filterset_fields = ['from_user']

    def perform_create(self, serializer):
        from_user = UserService.get_current_user(self.request)
        serializer.save(from_user=from_user)
