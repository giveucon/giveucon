from django.db import transaction
from rest_framework.serializers import ModelSerializer
from .location_serializer import LocationSerializer
from ..models import UserLocation

class UserLocationSerializer(ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model = UserLocation
        read_only_fields=('user',)
        fields = '__all__'

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = LocationSerializer(data=location_data)
        location.is_valid(raise_exception=True)
        with transaction.atomic():
            location = location.save()
            user_location = UserLocation.objects.create(**validated_data, location=location)
        return user_location

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location')
        location = LocationSerializer(instance.location, data=location_data, partial=True)
        location.is_valid(raise_exception=True)
        user = validated_data.pop('user', instance.user)
        with transaction.atomic():
            location.save()
            instance.location = location
            instance.user = user
            instance.save()
        return instance
