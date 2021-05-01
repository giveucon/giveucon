from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .image_serializer import ImageSerializer
from ..models import Product, Image
from ..services import ImageService

class ProductSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images'), [])
            product = Product(**validated_data)
            product.save()
            product.images.set(images)
            return product
