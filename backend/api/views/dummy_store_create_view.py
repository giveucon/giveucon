from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Store
from ..paginations import StorePagination
from ..serializers import StoreReadSerializer
from ..serializers import StoreWriteSerializer
from ..services import UserService

class DummyStoreCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = Store.objects.all()
    serializer_class_read = StoreReadSerializer
    serializer_class_write = StoreWriteSerializer
