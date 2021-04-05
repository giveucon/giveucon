from rest_framework import generics

from ..models import User, AccountUser, Coupon
from ..serializers import CouponSerializer

class CouponListView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
