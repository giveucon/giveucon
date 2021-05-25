from rest_framework import serializers
from ..models import CouponSelling
from .coupon_read_serializer import CouponReadSerializer
from .user_read_serializer import UserReadSerializer

class CouponSellingReadSerializer(serializers.ModelSerializer):
    coupon = CouponReadSerializer()
    status = serializers.SerializerMethodField(read_only=True)
    buyer = UserReadSerializer()
    class Meta:
        model = CouponSelling
        fields = '__all__'

    def get_status(self, instance):
        return instance.status.status
