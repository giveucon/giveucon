import requests
class WalletService():
    @staticmethod
    def get_address_balance(address):
        res = requests.get(f'https://sochain.com/api/v2/get_address_balance/BTC/{address}')
        return res.json()
