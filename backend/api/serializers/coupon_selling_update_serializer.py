from rest_framework import serializers
from ..models import CouponSelling
from .coupon_selling_status_serializer import CouponSellingStatusSerializer

class CouponSellingUpdateSerializer(serializers.ModelSerializer):
    status = CouponSellingStatusSerializer()
    class Meta:
        model = CouponSelling
        fields = '__all__'
        read_only_fields=('price', 'coupon')

    def update(self, instance, validated_data):
        '''
        with transaction.atomic():
            price = validated_data.pop('price')
            coupon = Coupon(**validated_data)
            coupon.otp_key = pyotp.random_base32()
            coupon.save()
            coupon = CouponService.sign_coupon(coupon)
            coupon.save()
            status = CouponSellingStatus.objects.get(status='open')
            coupon_selling = CouponSellingWriteSerializer(data={
                'price': price, 'coupon':coupon.pk, 'status': status.pk
            })
            coupon_selling.is_valid(raise_exception=True)
            coupon_selling.save()
        return coupon
        '''
        return super().update(instance, validated_data)
