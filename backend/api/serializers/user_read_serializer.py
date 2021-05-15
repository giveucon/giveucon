from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from ..models import User
from ..models import UserLocation
from .location_serializer import LocationSerializer

class UserReadSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = '__all__'
    def get_location(self, instance):
        try:
            location = UserLocation.objects.get(user=instance.pk).location
            return LocationSerializer(location).data
        except ObjectDoesNotExist:
            return None
