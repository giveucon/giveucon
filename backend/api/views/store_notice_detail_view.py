from rest_framework import generics

from ..models import StoreNotice
from ..serializers import StoreNoticeSerializer

class StoreNoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StoreNotice.objects.all()
    serializer_class = StoreNoticeSerializer
