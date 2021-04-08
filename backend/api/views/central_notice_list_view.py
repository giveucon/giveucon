from django.utils import timezone
from rest_framework import generics

from ..models import CentralNotice
from ..serializers import CentralNoticeSerializer

class CentralNoticeListView(generics.ListCreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class = CentralNoticeSerializer
