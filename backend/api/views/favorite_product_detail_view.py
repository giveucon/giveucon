from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import FavoriteProduct
from ..serializers import FavoriteProductReadSerializer
from ..serializers import FavoriteProductWriteSerializer

class FavoriteProductDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = FavoriteProduct.objects.all()
    serializer_class_read = FavoriteProductReadSerializer
    serializer_class_write = FavoriteProductWriteSerializer
