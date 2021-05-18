from django.db import transaction
from rest_framework import serializers
from ..models import Coupon
from .product_read_serializer import ProductReadSerializer

class CouponReadSerializer(serializers.ModelSerializer):
    expires_at = serializers.SerializerMethodField()

    product = ProductReadSerializer(read_only=True)
    class Meta:
        model = Coupon
        exclude = ('otp_key',)

    def get_expires_at(self, instance):
        return instance.created_at + instance.product.duration
