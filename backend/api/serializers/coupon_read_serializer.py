from django.db import transaction
from rest_framework.serializers import ModelSerializer
from ..models import Coupon
from .product_read_serializer import ProductReadSerializer

class CouponReadSerializer(ModelSerializer):
    product = ProductReadSerializer(read_only=True)
    class Meta:
        model = Coupon
        fields = '__all__'
