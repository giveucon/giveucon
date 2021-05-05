from rest_framework import generics

from ..models import FavoriteStore
from ..paginations import FavoriteStorePagination
from ..serializers import FavoriteStoreSerializer
from ..services import UserService

class FavoriteStoreListView(generics.ListCreateAPIView):
    queryset = FavoriteStore.objects.all()
    pagination_class = FavoriteStorePagination
    serializer_class = FavoriteStoreSerializer
    filterset_fields = ['user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
