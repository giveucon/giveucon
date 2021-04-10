import ecdsa
import json
from django.conf import settings
from django.db import transaction
from hashlib import sha256
from rest_framework.serializers import ModelSerializer
from ..models import Coupon

class CouponSerializer(ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'
        read_only_fields = ('signature',)

    @staticmethod
    def sign_coupon(coupon):
        private_key = ecdsa.SigningKey.from_string(
            bytes.fromhex(coupon.product.store.private_key),
            curve=ecdsa.SECP256k1,
            hashfunc=sha256
        )
        coupon_data = {
            'magic': 'giveucon',
            'coupon': coupon.pk,
        }
        print(json.dumps(coupon_data))
        coupon.signature = private_key.sign(
            bytes(json.dumps(coupon_data), 'utf-8')
        ).hex()
        return coupon

    def create(self, validated_data):
        coupon = Coupon(**validated_data)
        with transaction.atmoic():
            coupon.save()
            coupon = self.sign_coupon(coupon)
            coupon.save()
        return coupon

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        coupon = self.sign_coupon(instance)
        coupon.save()
        return coupon
