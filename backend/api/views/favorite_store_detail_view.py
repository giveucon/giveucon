from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import FavoriteStore
from ..serializers import FavoriteStoreReadSerializer
from ..serializers import FavoriteStoreWriteSerializer

class FavoriteStoreDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = FavoriteStore.objects.all()
    serializer_class_read = FavoriteStoreReadSerializer
    serializer_class_write = FavoriteStoreWriteSerializer

