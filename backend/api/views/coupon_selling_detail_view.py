from rest_framework import generics

from ..models import CouponSelling
from ..mixins import SerializerMixin
from ..serializers import CouponSellingReadSerializer
from ..serializers import CouponSellingCreateSerializer
from ..serializers import CouponSellingUpdateSerializer

class CouponSellingDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CouponSelling.objects.all()
    serializer_class_read = CouponSellingReadSerializer
    serializer_class_create = CouponSellingCreateSerializer
    serializer_class_update = CouponSellingUpdateSerializer
