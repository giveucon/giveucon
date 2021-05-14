import requests
from requests.auth import HTTPBasicAuth
from rest_framework.response import Response
from rest_framework.views import APIView
from giveucon.secrets import DJANGO_PAYPAL_CLIENT_ID
from giveucon.secrets import DJANGO_PAYPAL_CLIENT_SECRET

class PayPalTestView(APIView):
    def get(self, request):
        res = requests.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            headers={
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
            },
            auth=HTTPBasicAuth(DJANGO_PAYPAL_CLIENT_ID, DJANGO_PAYPAL_CLIENT_SECRET),
            data={'grant_type': 'client_credentials'},
        )
        return Response(res.json())
