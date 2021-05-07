from django.db import transaction
from rest_framework import serializers

from .friend_read_serializer import FriendReadSerializer
from ..models import Friend

class FriendWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = '__all__'
        read_only_fields = ('from_user',)

    def to_representation(self, instance):
        return FriendReadSerializer(instance).data
