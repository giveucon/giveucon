from rest_framework import generics

from ..models import CentralNotice
from ..mixins import SerializerMixin
from ..serializers import CentralNoticeReadSerializer
from ..serializers import CentralNoticeWriteSerializer

class CentralNoticeDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class_read = CentralNoticeReadSerializer
    serializer_class_write = CentralNoticeWriteSerializer
