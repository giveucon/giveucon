from rest_framework import generics

from ..models import CouponSelling
from ..mixins import SerializerMixin
from ..paginations import CouponSellingPagination
from ..serializers import CouponSellingReadSerializer
from ..serializers import CouponSellingCreateSerializer

class CouponSellingListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = CouponSelling.objects.all()
    pagination_class = CouponSellingPagination
    serializer_class_read = CouponSellingReadSerializer
    serializer_class_create = CouponSellingCreateSerializer
    filterset_fields = ['buyer__id', 'coupon__id', 'coupon__user__id', 'coupon__product__id', 'coupon__product__name', 'status__status']
    ordering_fields = ['expires_at']
