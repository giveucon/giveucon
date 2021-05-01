from rest_framework import generics

from ..models import FavoriteStore
from ..serializers import FavoriteStoreSerializer

class FavoriteStoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FavoriteStore.objects.all()
    serializer_class = FavoriteStoreSerializer
