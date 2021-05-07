from rest_framework import serializers

from ..serializers import ProductReadSerializer
from ..models import FavoriteProduct

class FavoriteProductReadSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer()
    class Meta:
        model = FavoriteProduct
        fields = '__all__'
        read_only_fields = ('user',)
