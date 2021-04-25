from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import User, AccountUser, Coupon
from ..paginations import CouponPagination
from ..serializers import CouponSerializer
from ..services import UserService

class CouponListView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    pagination_class = CouponPagination

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
