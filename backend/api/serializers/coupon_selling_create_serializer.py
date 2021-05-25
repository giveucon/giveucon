from rest_framework import serializers
from ..models import CouponSelling
from ..models import CouponSellingStatus

class CouponSellingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponSelling
        fields = '__all__'
        read_only_fields=('status',)

    def create(self, validated_data):
        status = CouponSellingStatus.objects.get(status='open')
        return CouponSelling.objects.create(**validated_data, status=status)
