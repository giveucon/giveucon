from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Coupon
from ..serializers import CouponQrReadSerializer

class CouponQrDetailView(SerializerMixin, generics.RetrieveAPIView):
    queryset = Coupon.objects.all()
    serializer_class_read = CouponQrReadSerializer
