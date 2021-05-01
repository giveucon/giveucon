import ecdsa
from django.db import transaction
from hashlib import sha256
from rest_framework import serializers

from ..models import Store
from ..serializers import StoreReadSerializer
from ..services import ImageService

class StoreWriteSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Store
        read_only_fields = ('user',)
        exclude = ('private_key', 'public_key')

    def create(self, validated_data):
        user = validated_data.pop('user')
        private_key = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1, hashfunc=sha256)
        public_key = private_key.get_verifying_key()

        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images', []))
            tags = validated_data.pop('tags', [])
            store = Store(**validated_data)
            store.user = user
            store.private_key = private_key.to_string().hex()
            store.public_key = public_key.to_string().hex()
            store.save()
            store.images.set(images)
            store.tags.set(tags)
            return store

    def update(self, instance, validated_data):
        with transaction.atomic():
            images = ImageService.save_images(validated_data.pop('images', []))
            tags = validated_data.pop('tags', instance.tags)
            instance.save()
            instance.images.all().delete()
            instance.images.set(images)
            instance.tags.set(tags)
            return instance

    def to_representation(self, instance):
        return StoreReadSerializer(instance).data
