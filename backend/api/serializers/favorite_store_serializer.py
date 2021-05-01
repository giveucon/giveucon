from rest_framework import serializers

from ..models import FavoriteStore

class FavoriteStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteStore
        fields = '__all__'
        read_only_fields = ('user',)
