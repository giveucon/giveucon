from rest_framework import generics

from ..models import StoreNotice
from ..serializers import DummyStoreNoticeCreateSerializer
from ..mixins import SerializerMixin

class DummyStoreNoticeCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = StoreNotice.objects.all()
    serializer_class_create = DummyStoreNoticeCreateSerializer
