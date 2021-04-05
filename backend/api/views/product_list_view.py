from django.utils import timezone
from rest_framework import generics

from ..models import Product
from ..serializers import ProductSerializer

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
