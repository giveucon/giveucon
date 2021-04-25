from rest_framework import generics

from ..models import Product
from ..paginations import ProductPagination
from ..serializers import ProductSerializer

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

    def perform_create(self, serializer):
        images = self.request.data.getlist('images')
        serializer.save(images=images)
