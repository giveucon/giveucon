import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from giveucon.secrets import DJANGO_PAYPAL_CLIENT_ID
from giveucon.secrets import DJANGO_PAYPAL_CLIENT_SECRET
from base64 import b64encode

class PayPalTestView(APIView):
    def get(self, request):
        authorization = 'Basic ' + b64encode(f'{DJANGO_PAYPAL_CLIENT_ID}:{DJANGO_PAYPAL_CLIENT_SECRET}'.encode()).decode()
        print(authorization)
        res = requests.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            {'grant_type': 'client_credentials'},
            {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization,
            }
        )
        return Response(res)
