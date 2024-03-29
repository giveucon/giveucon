import pyotp
from django.db import transaction
from rest_framework import serializers
from ..models import Coupon
from ..models import CouponSellingStatus
from ..services import CouponService
from .coupon_selling_create_serializer import CouponSellingCreateSerializer

class CouponCreateSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()
    class Meta:
        model = Coupon
        exclude = ('otp_key',)
        read_only_fields = ('signature', 'status', 'used', 'user')

    def create(self, validated_data):
        with transaction.atomic():
            price = validated_data.pop('price')
            coupon = Coupon(**validated_data)
            coupon.otp_key = pyotp.random_base32()
            coupon.save()
            coupon = CouponService.sign_coupon(coupon)
            coupon.save()
            status = CouponSellingStatus.objects.get(status='open')
            coupon_selling = CouponSellingCreateSerializer(data={
                'price': price, 'coupon':coupon.pk
            })
            coupon_selling.is_valid(raise_exception=True)
            coupon_selling.save()
        return coupon
