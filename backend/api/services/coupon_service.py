import ecdsa
import json
from hashlib import sha256
from django.shortcuts import get_object_or_404
from ..models import Coupon

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

    @staticmethod
    def verify_coupon(coupon_qr):
        if 'magic' not in coupon_qr or coupon_qr['magic'] != 'giveucon':
            print('Invalid coupon magic')
            return False
        if 'coupon' not in coupon_qr:
            print('Invalid coupon id')
            return False
        if 'signature' not in coupon_qr:
            print('Invalid coupon signature')
            return False

        signature = coupon_qr['signature']

        coupon_qr = {
            'magic': coupon_qr['magic'],
            'coupon': coupon_qr['coupon']
        }

        coupon = get_object_or_404(Coupon, pk=coupon_qr['coupon'])

        public_key = ecdsa.VerifyingKey.from_string(
            bytes.fromhex(coupon.product.store.public_key),
            curve=ecdsa.SECP256k1,
            hashfunc=sha256
        )

        verification = public_key.verify(
            bytes.fromhex(signature),
            bytes(json.dumps(coupon_qr), 'utf-8')
        )

        if verification == False:
            return False

        return coupon
