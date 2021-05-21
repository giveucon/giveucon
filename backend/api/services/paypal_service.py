import requests
import json
from requests.auth import HTTPBasicAuth

class PaypalService():
    def __init__(self, **kwargs):
        self.client_id = kwargs['client_id']
        self.client_secret = kwargs['client_secret']
        self.merchant_id = kwargs['merchant_id']
        self.bn_code = kwargs['bn_code']

    def get_access_token(self):
        res = requests.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            headers={
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
            },
            auth=HTTPBasicAuth(self.client_id, self.client_secret),
            data={'grant_type': 'client_credentials'},
        ).json()
        print(res)
        return res['access_token']

    def get_seller_onboarding_link(self, access_token, seller_id):
        res = requests.post(
            'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            },
            data=json.dumps({
                'tracking_id': f'{seller_id}',
                'operations': [
                    {
                        'operation': 'API_INTEGRATION',
                        'api_integration_preference': {
                            'rest_api_integration': {
                                'integration_method': 'PAYPAL',
                                'integration_type': 'THIRD_PARTY',
                                'third_party_details': {
                                    'features': [
                                        'PAYMENT',
                                        'REFUND'
                                    ]
                                }
                            }
                        }
                    }
                ],
                'products': [
                    'EXPRESS_CHECKOUT'
                ],
                'legal_consents': [
                    {
                        'type': 'SHARE_DATA_CONSENT',
                        'granted': True
                    }
               ]
            }),
        ).json()
        print(res)
        return {'onboard_link': res['links'][1]['href']}

    def get_seller_onboarding_status(self, access_token, seller_id):
        res = requests.get(
            f'https://api-m.sandbox.paypal.com/v1/customer/partners/{self.merchant_id}/merchant-integrations',
            headers={
                'Authorization': f'Bearer {access_token}'
            },
            params={'tracking_id': seller_id}
        ).json()
        return res

    def create_order(self, access_token, currency, payment, seller_email):
        res = requests.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}',
                'PayPal-Partner-Attribution-Id': self.bn_code
            },
            data=json.dumps({
                'intent': 'CAPTURE',
                'purchase_units': [{
                    'amount': {
                        'currency_code': currency,
                        'value': f'{payment}'
                    },
                    'payee': {
                        'email_address': seller_email
                    }
                }]
            })
        ).json()
        return res['id']

    def capture_order(self, access_token, order_id):
        res = requests.post(
            f'https://api-m.paypal.com/v2/checkout/orders/{order_id}/capture',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}',
                'PayPal-Partner-Attribution-Id': self.bn_code
            },
            data=json.dumps({})
        ).json()
        return res
