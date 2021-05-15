from rest_framework import serializers

from ..models import UserMenuItem

class UserMenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMenuItem
        fields = '__all__'
        read_only_fields = ('user',)
