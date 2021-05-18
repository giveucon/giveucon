from rest_framework.serializers import ModelSerializer
from ..models import CouponSelling

class CouponSellingWriteSerializer(ModelSerializer):
    class Meta:
        model = CouponSelling
        fields = '__all__'
