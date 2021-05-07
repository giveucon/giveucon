from rest_framework import serializers

from ..models import FavoriteProduct
from .favorite_product_read_serializer import FavoriteProductReadSerializer

class FavoriteProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteProduct
        fields = '__all__'
        read_only_fields = ('user',)

    def to_representation(self, instance):
        return FavoriteProductReadSerializer(instance).data
