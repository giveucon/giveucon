from rest_framework import serializers
from ..models import Coupon
from ..services import CouponService

class CouponScanUpdateSerializer(serializers.Serializer):
    magic = serializers.CharField(max_length=255)
    coupon = serializers.IntegerField()
    signature = serializers.CharField(min_length=128, max_length=128)
    otp = serializers.CharField(min_length=6, max_length=6)
'''
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance = CouponService.sign_coupon(instance)
        instance.save()
        return instance
'''
