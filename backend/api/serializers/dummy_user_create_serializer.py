from rest_framework.serializers import ModelSerializer
from ..models import User

class DummyUserCreateSerializer(ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ('staff',)
        fields = '__all__'
