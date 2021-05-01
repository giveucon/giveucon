from rest_framework.serializers import ModelSerializer

from ..models import Store
from .tag_serializer import TagSerializer
from .image_serializer import ImageSerializer

class StoreReadSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = Store
        read_only_fields = ('user',)
        exclude = ('private_key', 'public_key')
