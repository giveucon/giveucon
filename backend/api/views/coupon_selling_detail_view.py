from rest_framework import generics

from ..models import CouponSelling
from ..mixins import SerializerMixin
from ..serializers import CouponSellingReadSerializer
from ..serializers import CouponSellingWriteSerializer

class CouponSellingDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CouponSelling.objects.all()
    serializer_class_read = CouponSellingReadSerializer
    serializer_class_write = CouponSellingWriteSerializer