from django.db import transaction
from rest_framework import serializers

from .image_serializer import ImageSerializer
from .product_read_serializer import ProductReadSerializer
from ..models import Product
from ..services import ImageService

class ProductUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('store', )

    def update(self, instance, validated_data):
        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images', []))
            instance.name = validated_data.pop('name', instance.name)
            instance.description = validated_data.pop('description', instance.description)
            instance.price = validated_data.pop('price', instance.price)
            instance.duration = validated_data.pop('duration', instance.duration)
            instance.save()
            instance.images.all().delete()
            instance.images.set(images)
            return instance

    def to_representation(self, instance):
        return ProductReadSerializer(instance).data
