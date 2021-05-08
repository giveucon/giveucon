from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from twilio.rest import Client
from giveucon.secrets import DJANGO_TWILIO_SID
from giveucon.secrets import DJANGO_TWILIO_TOKEN
from giveucon.secrets import DJANGO_TWILIO_SENDER
from ..services import PhoneService

class PhoneVerificationCodeView(APIView):
    twilio = Client(DJANGO_TWILIO_SID, DJANGO_TWILIO_TOKEN)

    def post(self, request, *args, **kwargs):
        if 'phone_number' not in request.data:
            raise serializers.ValidationError({'phone_number': 'Invalid phone number'})
        phone_number = request.data['phone_number']
        verification_code = PhoneService.create_verification_code(phone_number)
        self.twilio.messages.create(
            to=phone_number,
            from_=DJANGO_TWILIO_SENDER,
            body=verification_code
        )
        return Response({'sent': True})
