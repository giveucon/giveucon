from urllib.parse import urljoin
from rest_framework import serializers
from giveucon.settings import DJANGO_BASE_URL
from ..models import Image

class ImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = '__all__'
    def get_image(self, instance):
        return urljoin(DJANGO_BASE_URL, instance.image.url)

