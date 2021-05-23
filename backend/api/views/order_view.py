from django.conf import settings
from rest_framework import generics
from rest_framework.response import Response

from ..models import CouponSelling
from ..services import PaypalService
from ..services import UserService
from rest_framework.views import APIView

class OrderView(APIView):
    def __init__(self):
        self.paypal_service = PaypalService(
            client_id=settings.DJANGO_PAYPAL_CLIENT_ID,
            client_secret=settings.DJANGO_PAYPAL_CLIENT_SECRET,
            merchant_id=settings.DJANGO_PAYPAL_MERCHANT_ID,
            bn_code=settings.DJANGO_PAYPAL_BN_CODE,
        )

    def post(self, request):
        coupon_selling_id = int(request.data['coupon_selling'])
        coupon_selling = CouponSelling.objects.get(pk=coupon_selling_id)
        access_token = self.paypal_service.get_access_token()
        print('order access token', access_token)
        user = UserService.get_current_user(request)
        res = self.paypal_service.create_order(
            access_token,
            'USD',
            coupon_selling.price,
            coupon_selling.coupon.user.email
        )
        return Response(res)
