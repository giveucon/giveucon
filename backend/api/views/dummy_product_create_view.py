from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Product
from ..serializers import DummyProductCreateSerializer

class DummyProductCreateView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class_create = DummyProductCreateSerializer
