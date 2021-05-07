from django.db import transaction
from rest_framework import serializers
from .user_serializer import UserSerializer
from ..models import Friend

class FriendReadSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()
    to_user = UserSerializer()

    class Meta:
        model = Friend
        fields = '__all__'
