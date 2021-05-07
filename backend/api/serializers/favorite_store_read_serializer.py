from rest_framework import serializers

from ..models import FavoriteStore
from .store_read_serializer import StoreReadSerializer

class FavoriteStoreReadSerializer(serializers.ModelSerializer):
    store = StoreReadSerializer()
    class Meta:
        model = FavoriteStore
        fields = '__all__'
