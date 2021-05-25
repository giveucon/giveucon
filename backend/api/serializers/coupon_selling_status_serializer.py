from rest_framework import serializers
from ..models import CouponSellingStatus

class CouponSellingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponSellingStatus
        fields = '__all__'
        extra_kwargs = {'status': {'validators': []}}
