from rest_framework import serializers
from ..models import CouponSelling
from ..models import CouponSellingStatus
from .coupon_selling_status_serializer import CouponSellingStatusSerializer

class CouponSellingUpdateSerializer(serializers.ModelSerializer):
    status = CouponSellingStatusSerializer()
    class Meta:
        model = CouponSelling
        fields = '__all__'
        read_only_fields=('price', 'coupon')

    def validate_status(self, value):
        return CouponSellingStatus.objects.get(status=value['status'])

    def update(self, instance, validated_data):
        prev_status = instance.status.status
        next_status = validated_data.pop('status')
        if ((prev_status == 'open' and next_status.status == 'pre_pending')
             or (prev_status == 'pre_pending' and next_status.status == 'open')
             or (prev_status == 'pre_pending' and next_status.status == 'pending')
             or (prev_status == 'pending' and next_status.status == 'closed')):
            instance.status = next_status
            instance.save()
            return instance
        raise serializers.ValidationError({
           'status': 'Invalid status'
        })
