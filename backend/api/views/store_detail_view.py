from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Store
from ..serializers import StoreReadSerializer
from ..serializers import StoreWriteSerializer

class StoreDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.all()
    serializer_class_read = StoreReadSerializer
    serializer_class_write = StoreWriteSerializer
