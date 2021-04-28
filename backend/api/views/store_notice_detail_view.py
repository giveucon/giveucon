from rest_framework import generics

from ..models import StoreNotice
from ..serializers import StoreNoticeReadSerializer
from ..serializers import StoreNoticeWriteSerializer
from ..mixins import SerializerMixin

class StoreNoticeDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = StoreNotice.objects.all()
    serializer_class_read = StoreNoticeReadSerializer
    serializer_class_write = StoreNoticeWriteSerializer
