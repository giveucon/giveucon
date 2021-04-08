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
        print('requested with', request.data)
        if req_type == 'scan':
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
            print(coupon)
            public_key = ecdsa.VerifyingKey.from_string(
                bytes.fromhex(coupon.product.store.public_key),
                curve=ecdsa.SECP256k1,
                hashfunc=sha256
            )
             
            print(public_key.verify(bytes.fromhex(signature),
                bytes(json.dumps(coupon_data), 'utf-8')))

            coupon.used = True
            coupon.save()
            serializer = self.get_serializer(coupon)
            return Response(serializer.data)
        elif req_type == 'trade':
            coupon = get_object_or_404(Coupon, pk=kwargs.get('pk'))
            serializer = self.get_serializer(coupon, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            print('no type!')
            raise exceptions.ParseError

