import ecdsa
from django.db import transaction
from hashlib import sha256
from rest_framework import serializers

from ..models import Store
from ..serializers import StoreWriteSerializer

class DummyStoreWriteSerializer(StoreWriteSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)
    class Meta:
        model = Store
        exclude = ('private_key', 'public_key')
