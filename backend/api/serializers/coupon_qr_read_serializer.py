import pyotp
from django.db import transaction
from rest_framework import serializers
from ..models import Coupon

class CouponQrReadSerializer(serializers.Serializer):
    def to_representation(self, instance):
        totp = pyotp.TOTP(instance.otp_key)
        return {
            'magic': 'giveucon',
            'coupon': instance.pk,
            'signature': instance.signature,
            'otp': totp.now()
        }
