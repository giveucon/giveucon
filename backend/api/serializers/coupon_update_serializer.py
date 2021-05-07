from rest_framework.serializers import ModelSerializer
from ..models import Coupon
from ..services import CouponService

class CouponUpdateSerializer(ModelSerializer):
    class Meta:
        model = Coupon
        exclude = ('otp_key',)
        read_only_fields = ('signature', 'product', 'used')

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance = CouponService.sign_coupon(instance)
        instance.save()
        return instance
