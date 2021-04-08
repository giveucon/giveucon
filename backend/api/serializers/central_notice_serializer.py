from rest_framework.serializers import ModelSerializer
from ..models import CentralNotice
from django.conf import settings

class CentralNoticeSerializer(ModelSerializer):
    class Meta:
        model = CentralNotice
        fields = '__all__'
