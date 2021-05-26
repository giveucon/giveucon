import pyotp
from django.db import transaction
from rest_framework import serializers
from ..models import Coupon
from ..models import CouponSelling
from ..models import CouponSellingStatus
from .coupon_read_serializer import CouponReadSerializer

class CouponGiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        exclude = ('otp_key',)
        read_only_fields = ('signature', 'product', 'used')
    def update(self, instance, validated_data):
        with transaction.atomic():
            try:
                coupon_selling = CouponSelling.objects.get(coupon=instance.id)
                coupon_selling.status = CouponSellingStatus.objects.get(status='closed')
                coupon_selling.save()
            except CouponSelling.DoesNotExist:
                pass
            user = validated_data.pop('user')
            if instance.user.pk == user.pk:
                raise serializers.ValidationError({
                    'user': 'Cannot give the coupon to yourself'
                })
            instance.user = user
            instance.save()
            return instance
    def to_representation(self, instance):
        return CouponReadSerializer(instance).data
