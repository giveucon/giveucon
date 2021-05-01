from django.db import transaction
from hashlib import sha256
from rest_framework.serializers import ModelSerializer
from ..models import Coupon
from ..services import CouponService

class CouponCreateSerializer(ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'
        read_only_fields = ('signature', 'used', 'user')

    def create(self, validated_data):
        with transaction.atomic():
            coupon = Coupon(**validated_data)
            coupon.save()
            coupon = CouponService.sign_coupon(coupon)
            coupon.save()
        return coupon
