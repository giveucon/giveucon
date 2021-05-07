from rest_framework import serializers

from ..models import FavoriteStore
from .favorite_store_read_serializer import FavoriteStoreReadSerializer

class FavoriteStoreWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteStore
        fields = '__all__'
        read_only_fields = ('user',)

    def to_representation(self, instance):
        return FavoriteStoreReadSerializer(instance).data
