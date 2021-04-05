from rest_framework import generics

from ..models import Coupon
from ..serializers import CouponSerializer

class CouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
