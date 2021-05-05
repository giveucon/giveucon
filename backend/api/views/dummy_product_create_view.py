from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Product
from ..serializers import ProductCreateSerializer

class DummyProductCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class_create = ProductCreateSerializer
