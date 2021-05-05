from django.shortcuts import get_object_or_404
import ecdsa
from hashlib import sha256
import json
from rest_framework import exceptions
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import Coupon
from ..serializers import CouponScanUpdateSerializer
from ..services import CouponService

class CouponScanView(SerializerMixin, generics.UpdateAPIView):
    queryset = Coupon.objects.all()
    serializer_class_update = CouponScanUpdateSerializer

# magic, coupon, signature
    def update(self, request, *args, **kwargs):
        CouponService.verify_coupon(request.data)
        coupon.used = True
        coupon.save()
        serializer = self.get_serializer(coupon)
        return Response(serializer.data)
