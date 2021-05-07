from django.db import transaction
from rest_framework.serializers import BaseSerializer
import pyotp
from ..models import Coupon

class CouponQrReadSerializer(BaseSerializer):
    def to_representation(self, instance):
        totp = pyotp.TOTP(instance.otp_key)
        return {
            'magic': 'giveucon',
            'coupon': instance.pk,
            'signature': instance.signature,
            'otp': totp.now()
        }
