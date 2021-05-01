from rest_framework import serializers

from ..models import FavoriteProduct

class FavoriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteProduct
        fields = '__all__'
        read_only_fields = ('user',)
