from rest_framework import generics

from ..models import CentralNotice
from ..serializers import CentralNoticeReadSerializer
from ..serializers import CentralNoticeWriteSerializer
from ..mixins import SerializerMixin

class CentralNoticeDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class_read = CentralNoticeReadSerializer
    serializer_class_write = CentralNoticeWriteSerializer
