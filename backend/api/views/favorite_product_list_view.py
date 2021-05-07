from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import FavoriteProduct
from ..paginations import FavoriteProductPagination
from ..serializers import FavoriteProductReadSerializer
from ..serializers import FavoriteProductWriteSerializer
from ..services import UserService

class FavoriteProductListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = FavoriteProduct.objects.all()
    pagination_class = FavoriteProductPagination
    serializer_class_read = FavoriteProductReadSerializer
    serializer_class_write = FavoriteProductWriteSerializer
    filterset_fields = ['user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
