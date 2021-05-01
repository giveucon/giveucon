from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import Coupon
from ..paginations import CouponPagination
from ..serializers import CouponReadSerializer
from ..serializers import CouponCreateSerializer
from ..services import UserService

class CouponListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class_read = CouponReadSerializer
    serializer_class_create = CouponCreateSerializer
    pagination_class = CouponPagination

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
