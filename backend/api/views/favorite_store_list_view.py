from rest_framework import generics

from ..models import FavoriteStore
from ..serializers import FavoriteStoreSerializer
from ..services import UserService

class FavoriteStoreListView(generics.ListCreateAPIView):
    queryset = FavoriteStore.objects.all()
    serializer_class = FavoriteStoreSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
