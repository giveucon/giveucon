from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from ..models import StoreLocation
from ..models import Store
from .image_serializer import ImageSerializer
from .location_serializer import LocationSerializer
from .tag_serializer import TagSerializer

class StoreReadSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    location = serializers.SerializerMethodField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = Store
        read_only_fields = ('user',)
        exclude = ('private_key', 'public_key')
    def get_location(self, instance):
        try:
            location = StoreLocation.objects.get(store=instance.pk).location
            return LocationSerializer(location).data
        except ObjectDoesNotExist:
            return None
