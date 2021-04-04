import ecdsa
from django.conf import settings
from hashlib import sha256
from rest_framework.serializers import ModelSerializer
from ..models import Store

class StoreSerializer(ModelSerializer):
    class Meta:
        model = Store
        exclude = ('private_key', 'public_key')
    def create(self, validated_data):
        private_key = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1, hashfunc=sha256)
        public_key = private_key.get_verifying_key()
        store = Store(**validated_data)
        store.private_key = private_key.to_string().hex()
        store.public_key = public_key.to_string().hex()
        store.save()
        return store
