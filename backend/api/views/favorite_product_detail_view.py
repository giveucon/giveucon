from rest_framework import generics

from ..models import FavoriteProduct
from ..serializers import FavoriteProductSerializer

class FavoriteProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FavoriteProduct.objects.all()
    serializer_class = FavoriteProductSerializer
