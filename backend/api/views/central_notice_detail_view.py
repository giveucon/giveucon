from rest_framework import generics

from ..models import CentralNotice
from ..serializers import CentralNoticeReadSerializer

class CentralNoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class = CentralNoticeReadSerializer
