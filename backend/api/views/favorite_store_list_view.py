from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import FavoriteStore
from ..paginations import FavoriteStorePagination
from ..serializers import FavoriteStoreReadSerializer
from ..serializers import FavoriteStoreWriteSerializer
from ..services import UserService

class FavoriteStoreListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = FavoriteStore.objects.all()
    pagination_class = FavoriteStorePagination
    serializer_class_read = FavoriteStoreReadSerializer
    serializer_class_write = FavoriteStoreWriteSerializer
    filterset_fields = ['user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
