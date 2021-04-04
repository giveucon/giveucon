from rest_framework.serializers import ModelSerializer
from ..models import User
from django.conf import settings


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
