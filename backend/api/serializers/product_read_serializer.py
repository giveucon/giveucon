from rest_framework.serializers import ModelSerializer

from .image_serializer import ImageSerializer
from ..models import Product

class ProductReadSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
