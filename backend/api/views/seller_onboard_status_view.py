from django.conf import settings
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..serializers import CouponScanUpdateSerializer
from ..services import PaypalService
from ..services import UserService
from rest_framework.views import APIView
import os.path

class SellerOnboardStatusView(APIView):
    def __init__(self):
        self.paypal_service = PaypalService(
            client_id=settings.DJANGO_PAYPAL_CLIENT_ID,
            client_secret=settings.DJANGO_PAYPAL_CLIENT_SECRET,
            merchant_id=settings.DJANGO_PAYPAL_MERCHANT_ID,
            bn_code=settings.DJANGO_PAYPAL_BN_CODE,
        )
    def get(self, request):
        access_token = self.paypal_service.get_access_token()
        user = UserService.get_current_user(request)
        seller_merchant_id = self.paypal_service.get_seller_merchant_id(
            access_token,
            self.paypal_service.get_seller_referral_id(access_token, user.pk)
        )

        res = self.paypal_service.get_seller_onboarding_status(access_token, seller_merchant_id)
        return Response(res)

