import ecdsa
import json
from django.conf import settings
from hashlib import sha256
from rest_framework.serializers import ModelSerializer
from ..models import Coupon

class CouponSerializer(ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'
        read_only_fields = ('signature', 'user')
    def create(self, validated_data):
        coupon = Coupon(**validated_data)
        private_key = ecdsa.SigningKey.from_string(
            bytes.fromhex(coupon.product.store.private_key),
            curve=ecdsa.SECP256k1,
            hashfunc=sha256
        )
        coupon_data = {
            'magic': 'giveucon',
            'user': coupon.user.pk,
            'product': coupon.product.pk
        }
        coupon.signature = private_key.sign(
            bytearray(json.dumps(coupon_data), 'utf-8')
        ).hex()
        coupon.save()
        return coupon
