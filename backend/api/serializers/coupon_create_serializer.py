import pyotp
from django.db import transaction
from rest_framework import serializers
from ..models import Coupon
from ..services import CouponService
from .coupon_selling_write_serializer import CouponSellingWriteSerializer

class CouponCreateSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()
    class Meta:
        model = Coupon
        exclude = ('otp_key',)
        read_only_fields = ('signature', 'used', 'user')

    def create(self, validated_data):
        with transaction.atomic():
            price = validated_data.pop('price')
            coupon = Coupon(**validated_data)
            coupon.otp_key = pyotp.random_base32()
            coupon.save()
            coupon = CouponService.sign_coupon(coupon)
            coupon.save()
            coupon_selling = CouponSellingWriteSerializer(data={'price': price, 'coupon':coupon.pk})
            coupon_selling.is_valid(raise_exception=True)
            coupon_selling.save()
        return coupon
