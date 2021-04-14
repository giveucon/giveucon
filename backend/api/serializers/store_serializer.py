import ecdsa
from django.db import transaction
from hashlib import sha256
from rest_framework.serializers import ModelSerializer

from .image_serializer import ImageSerializer
from ..models import Store, Image

class StoreSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Store
        read_only_fields = ('user',)
        exclude = ('private_key', 'public_key')

    def create(self, validated_data):
        user = validated_data.pop('user')
        images_data = validated_data.pop('images')
        tags = validated_data.pop('tags')
        private_key = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1, hashfunc=sha256)
        public_key = private_key.get_verifying_key()

        with transaction.atomic():
            store = Store(**validated_data)
            store.user = user
            store.private_key = private_key.to_string().hex()
            store.public_key = public_key.to_string().hex()
            images = Image.objects.bulk_create([Image() for _ in images_data])
            for i in range(len(images)):
                images[i].image.save(images_data[i].name, images_data[i])
            store.save()
            store.images.set(images)
            store.tags.set(tags)
            return store
