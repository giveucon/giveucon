from django.db import transaction
from rest_framework.serializers import ModelSerializer
from .location_serializer import LocationSerializer
from ..models import StoreLocation

class StoreLocationSerializer(ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model = StoreLocation
        fields = '__all__'

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = LocationSerializer(data=location_data)
        location.is_valid(raise_exception=True)
        with transaction.atomic():
            location = location.save()
            store_location = StoreLocation.objects.create(**validated_data, location=location)
        return store_location

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location')
        location = LocationSerializer(instance.location, data=location_data, partial=True)
        location.is_valid(raise_exception=True)
        store = validated_data.pop('store', instance.store)
        with transaction.atomic():
            location = location.save()
            instance.location = location
            instance.store = store
            instance.save()
        return instance
