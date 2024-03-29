import requests
import json
import os.path
from requests.auth import HTTPBasicAuth
from urllib.parse import urlparse

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
        return {'info_link': res['links'][0]['href'], 'onboard_link': res['links'][1]['href']}

    def get_seller_referral_id(self, access_token, seller_id):
        links = self.get_seller_onboarding_link(access_token, seller_id)
        return os.path.split(urlparse(links['info_link']).path)[-1]

    def get_seller_merchant_id(self, access_token, referral_id):

        res = requests.get(
            f'https://api-m.sandbox.paypal.com/v1/customer/partner-referrals/{referral_id}',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
        ).json()
        print(res)
        return res['referral_data']['customer_data']['referral_user_payer_id']['value']

    def get_seller_onboarding_status(self, access_token, seller_merchant_id):
        res = requests.get(
            f'https://api-m.sandbox.paypal.com/v1/customer/partners/{self.merchant_id}/merchant-integrations/{seller_merchant_id}',
            headers={
                'Authorization': f'Bearer {access_token}'
            },
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
        print(res)
        return res

    def capture_order(self, access_token, order_id):
        print(f'Bearer {access_token}')
        res = requests.post(
            f'https://api-m.paypal.com/v2/checkout/orders/{order_id}/capture',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}',
                'PayPal-Partner-Attribution-Id': self.bn_code
            },
            data=json.dumps({})
        )
        print(dir(res))
        return res.json()
