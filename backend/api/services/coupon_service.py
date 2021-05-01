import ecdsa
import json
from hashlib import sha256

class CouponService():
    @staticmethod
    def sign_coupon(coupon):
        private_key = ecdsa.SigningKey.from_string(
            bytes.fromhex(coupon.product.store.private_key),
            curve=ecdsa.SECP256k1,
            hashfunc=sha256
        )
        coupon_data = {
            'magic': 'giveucon',
            'coupon': coupon.pk,
        }
        coupon.signature = private_key.sign(
            bytes(json.dumps(coupon_data), 'utf-8')
        ).hex()
        return coupon
