from django.db import transaction
from rest_framework import serializers

from .image_serializer import ImageSerializer
from .product_read_serializer import ProductReadSerializer
from ..models import Product
from ..services import ImageService

class ProductCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images', []))
            product = Product(**validated_data)
            product.save()
            product.images.set(images)
            return product

    def to_representation(self, instance):
        return ProductReadSerializer(instance).data
