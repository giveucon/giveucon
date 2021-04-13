from rest_framework.serializers import ModelSerializer
from ..models import Account
from django.conf import settings

class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        exclude = ('password',)
