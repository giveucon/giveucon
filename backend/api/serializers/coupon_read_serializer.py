from django.db import transaction
from rest_framework import serializers
from ..models import Coupon
from .product_read_serializer import ProductReadSerializer
from .user_read_serializer import UserReadSerializer

class CouponReadSerializer(serializers.ModelSerializer):
    expires_at = serializers.SerializerMethodField()
    product = ProductReadSerializer(read_only=True)
    user = UserReadSerializer()
    class Meta:
        model = Coupon
        exclude = ('otp_key',)

    def get_expires_at(self, instance):
        return instance.created_at + instance.product.duration
