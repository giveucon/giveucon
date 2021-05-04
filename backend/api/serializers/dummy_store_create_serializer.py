import ecdsa
from django.db import transaction
from hashlib import sha256
from rest_framework import serializers

from ..models import Store
from ..services import ImageService

class DummyStoreCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Store
        exclude = ('private_key', 'public_key')

    def create(self, validated_data):
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
