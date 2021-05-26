from django.core.exceptions import ObjectDoesNotExist 
from django.db import transaction
from rest_framework import exceptions
from rest_framework import generics
from rest_framework.response import Response

from ..models import Coupon
from ..models import CouponSelling
from ..services import UserService
from ..serializers import CouponGiveSerializer

class CouponGiveView(generics.UpdateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponGiveSerializer
