from django.core.exceptions import ObjectDoesNotExist 
from django.db import transaction
from rest_framework import exceptions
from rest_framework import views
from rest_framework.response import Response

from ..models import Coupon
from ..models import CouponSelling
from ..services import UserService

class CouponBuyView(views.APIView):
    def put(self, request, *args, **kwargs):
        print(kwargs['pk'])
        with transaction.atomic():
            try:
                coupon_selling = CouponSelling.objects.get(coupon__pk=kwargs['pk'])
                coupon_selling.delete()
                coupon = Coupon.objects.get(pk=kwargs['pk'])
                user = UserService.get_current_user(request)
                if coupon.user.id == user:
                    return Response({'ok': False, 'err': 'Same seller and buyer'})
                coupon.save()
            except ObjectDoesNotExist:
                ex = exceptions.NotFound()
                return Response({'ok': False, 'err': ex.detail}, ex.status_code)
            return Response({'ok': True})

