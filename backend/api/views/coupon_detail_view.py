from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import Coupon
from ..serializers import CouponSerializer

class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def update(self, request, *args, **kwargs):
        print(request.query_params.get('type'))
        coupon = get_object_or_404(Coupon, pk=kwargs.get('pk'))
        serializer = self.get_serializer(coupon, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
