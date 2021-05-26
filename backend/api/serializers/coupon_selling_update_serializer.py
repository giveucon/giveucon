from rest_framework import serializers
from ..models import CouponSelling
from ..models import CouponSellingStatus
from .coupon_selling_status_serializer import CouponSellingStatusSerializer
from .coupon_selling_read_serializer import CouponSellingReadSerializer

class CouponSellingUpdateSerializer(serializers.ModelSerializer):
    status = CouponSellingStatusSerializer()
    class Meta:
        model = CouponSelling
        fields = '__all__'
        read_only_fields=('coupon', 'buyer')
        extra_kwargs = {'price': {'required': False}}

    def validate_status(self, value):
        return CouponSellingStatus.objects.get(status=value['status'])

    def update(self, instance, validated_data):
        prev_status = instance.status.status
        next_status = validated_data.pop('status')
        user = validated_data.pop('user')
        if not ((prev_status == 'open' and next_status.status == 'pre_pending')
             or (prev_status == 'pre_pending' and next_status.status == 'open')
             or (prev_status == 'pre_pending' and next_status.status == 'pending')
             or (prev_status == 'pending' and next_status.status == 'closed')):
            raise serializers.ValidationError({
               'status': 'Invalid status'
            })
        elif next_status.status == 'open':
            instance.buyer = None
            if prev_status == 'closed':
                instance.price = validated_data.pop('price', instance.price)
        elif next_status.status == 'pre_pending':
            instance.buyer = user
        elif next_status.status == 'closed':
            instance.coupon.user = instance.buyer
            instance.coupon.save()

        instance.status = next_status
        instance.save()
        return instance

    def to_representation(self, instance):
        return CouponSellingReadSerializer(instance).data
