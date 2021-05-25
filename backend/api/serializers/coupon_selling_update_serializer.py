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
        print('validate status', value)
        return CouponSellingStatus.objects.get(status=value).status

    def validate(self, data):
        print('validate')
        return data

    def update(self, instance, validated_data):
        print('here is update serializer')
        prev_status = instance.status.status
        next_status = validated_data.pop('status')
        if ((prev_status == 'open' and next_status == 'pre_pending')
             or (prev_status == 'pre_pending' and next_status == 'open')
             or (prev_status == 'pre_pending' and next_status == 'pending')
             or (prev_status == 'pending' and next_status == 'closed')):
            instance.status.status = next_status
            instance.save()
        else:
            raise serializers.ValidationError({
                'verification_code': 'Invalid verification code'
            })
