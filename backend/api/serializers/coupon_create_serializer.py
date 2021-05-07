import pyotp
from django.db import transaction
from rest_framework.serializers import ModelSerializer
from ..models import Coupon
from ..services import CouponService

class CouponCreateSerializer(ModelSerializer):
    class Meta:
        model = Coupon
        exclude = ('otp_key',)
        read_only_fields = ('signature', 'used', 'user')

    def create(self, validated_data):
        with transaction.atomic():
            coupon = Coupon(**validated_data)
            coupon.otp_key = pyotp.random_base32()
            coupon.save()
            coupon = CouponService.sign_coupon(coupon)
            coupon.save()
        return coupon
