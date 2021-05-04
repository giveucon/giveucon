from rest_framework.serializers import ModelSerializer
from ..models import Tag

class DummyTagCreateSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
