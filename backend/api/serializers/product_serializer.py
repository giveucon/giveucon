from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .image_serializer import ImageSerializer
from ..models import Product, Image

class ProductSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images')

        with transaction.atomic():
            product = Product(**validated_data)
            images = Image.objects.bulk_create([Image() for _ in images_data])
            for i in range(len(images)):
                images[i].image.save(images_data[i].name, images_data[i])
            product.save()
            product.images.set(images)
            return product
