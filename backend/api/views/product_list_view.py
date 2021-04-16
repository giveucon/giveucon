from rest_framework import generics

from ..models import Product
from ..serializers import ProductSerializer

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        images = self.request.data.getlist('images')
        serializer.save(images=images)
