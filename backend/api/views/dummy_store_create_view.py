from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Store
from ..serializers import DummyStoreWriteSerializer

class DummyStoreCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = Store.objects.all()
    serializer_class_create = DummyStoreWriteSerializer
