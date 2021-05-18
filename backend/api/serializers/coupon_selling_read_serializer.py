from rest_framework.serializers import ModelSerializer
from ..models import CouponSelling
from .coupon_read_serializer import CouponReadSerializer

class CouponSellingReadSerializer(ModelSerializer):
    coupon = CouponReadSerializer()
    class Meta:
        model = CouponSelling
        fields = '__all__'
