from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Product
from ..paginations import ProductPagination
from ..serializers import ProductReadSerializer
from ..serializers import ProductCreateSerializer

class ProductListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class_read = ProductReadSerializer
    serializer_class_create = ProductCreateSerializer
    pagination_class = ProductPagination
