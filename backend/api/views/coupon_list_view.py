from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import Coupon
from ..paginations import CouponPagination
from ..serializers import CouponReadSerializer
from ..serializers import CouponMultiCreateSerializer
from ..services import UserService

class CouponListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    pagination_class = CouponPagination
    serializer_class_read = CouponReadSerializer
    serializer_class_create = CouponMultiCreateSerializer
    filterset_fields = ['user', 'product', 'used']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
