from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Store
from ..paginations import StorePagination
from ..serializers import StoreReadSerializer
from ..serializers import StoreWriteSerializer
from ..services import UserService

class StoreListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class_read = StoreReadSerializer
    serializer_class_write = StoreWriteSerializer
    pagination_class = StorePagination
    filterset_fields = ['user', 'tags']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
