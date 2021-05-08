import pyotp
from base64 import b32encode

OTP_INTERVAL = 180

class PhoneService():
    @staticmethod
    def create_verification_code(phone_number):
        totp = pyotp.TOTP(b32encode(phone_number.encode()).decode(), interval=OTP_INTERVAL)
        return totp.now()

    @staticmethod
    def verify_phone_number(phone_number, verification_code):
        totp = pyotp.TOTP(b32encode(phone_number.encode()).decode(), interval=OTP_INTERVAL)
        return totp.verify(verification_code)
