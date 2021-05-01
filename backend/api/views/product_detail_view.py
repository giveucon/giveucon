from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Product
from ..serializers import ProductReadSerializer
from ..serializers import ProductUpdateSerializer

class ProductDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class_read = ProductReadSerializer
    serializer_class_update = ProductUpdateSerializer
