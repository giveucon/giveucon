from rest_framework.serializers import ModelSerializer
from ..models import Image
from django.conf import settings

class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
