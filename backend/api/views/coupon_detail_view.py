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

class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def retrieve(self, request, *args, **kwargs):
        coupon = get_object_or_404(Coupon, pk=kwargs.get('pk'))
        req_type = request.query_params.get('type')
        if req_type == 'qr':
            coupon_data = {
                'magic': 'giveucon',
                'coupon': coupon.pk,
                'signature': coupon.signature
            }
            return Response(coupon_data)

        serializer = self.get_serializer(coupon)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        req_type = request.query_params.get('type')
        if req_type == 'trade':
            coupon = get_object_or_404(Coupon, pk=kwargs.get('pk'))
            serializer = self.get_serializer(coupon, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            raise exceptions.ParseError

