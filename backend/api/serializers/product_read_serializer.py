from rest_framework.serializers import ModelSerializer

from .image_serializer import ImageSerializer
from .store_read_serializer import StoreReadSerializer
from ..models import Product

class ProductReadSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    store = StoreReadSerializer()
    class Meta:
        model = Product
        fields = '__all__'
