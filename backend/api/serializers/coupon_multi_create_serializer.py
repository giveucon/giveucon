import pyotp
from django.db import transaction
from rest_framework import serializers
from .coupon_create_serializer import CouponCreateSerializer
from ..utils import to_external_value

class CouponMultiCreateSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    coupon = CouponCreateSerializer()

    def create(self, validated_data):
        with transaction.atomic():
            user = validated_data.pop('user')
            count = validated_data.pop('count')
            coupon_data = dict(to_external_value(validated_data.pop('coupon')))
            with transaction.atomic():
                for _ in range(count):
                    coupon = CouponCreateSerializer(data=coupon_data)
                    coupon.is_valid(raise_exception=True)
                    coupon.save(user=user)
                return count

    def to_representation(self, count):
        return {'count': count}
