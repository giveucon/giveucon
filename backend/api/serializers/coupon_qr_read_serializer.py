from django.db import transaction
from rest_framework.serializers import BaseSerializer
from ..models import Coupon

class CouponQrReadSerializer(BaseSerializer):
    def to_representation(self, instance):
        return {
            'magic': 'giveucon',
            'coupon': instance.pk,
            'signature': instance.signature
        }
