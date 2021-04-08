from django.shortcuts import get_object_or_404
import ecdsa
from hashlib import sha256
import json
from rest_framework import exceptions
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from ..models import Coupon
from ..serializers import CouponSerializer

class CouponScanView(generics.UpdateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def update(self, request, *args, **kwargs):
        if ('magic' not in request.data
            or request.data['magic'] != 'giveucon'
            or 'coupon' not in request.data
            or 'signature' not in request.data):
            raise exceptions.ParseError
        coupon_data = {
            'magic': request.data['magic'],
            'coupon': request.data['coupon']
        }
        signature = request.data['signature']
        coupon = get_object_or_404(Coupon, pk=coupon_data['coupon'])
        public_key = ecdsa.VerifyingKey.from_string(
            bytes.fromhex(coupon.product.store.public_key),
            curve=ecdsa.SECP256k1,
            hashfunc=sha256
        )
        verification = public_key.verify(
            bytes.fromhex(signature),
            bytes(json.dumps(coupon_data), 'utf-8')
        )
        coupon.used = True
        coupon.save()
        serializer = self.get_serializer(coupon)
        return Response(serializer.data)
