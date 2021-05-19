from rest_framework import generics

from ..models import CouponSelling
from ..mixins import SerializerMixin
from ..serializers import CouponSellingReadSerializer
from ..serializers import CouponSellingWriteSerializer

class CouponSellingListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = CouponSelling.objects.all()
    serializer_class_read = CouponSellingReadSerializer
    serializer_class_write = CouponSellingWriteSerializer
    filterset_fields = ['coupon__product']
    ordering_fields = ['expires_at']
