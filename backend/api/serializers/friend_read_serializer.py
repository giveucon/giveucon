from django.db import transaction
from rest_framework import serializers
from .user_read_serializer import UserReadSerializer
from ..models import Friend

class FriendReadSerializer(serializers.ModelSerializer):
    from_user = UserReadSerializer()
    to_user = UserReadSerializer()

    class Meta:
        model = Friend
        fields = '__all__'
