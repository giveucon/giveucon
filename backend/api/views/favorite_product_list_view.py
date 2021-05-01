from rest_framework import generics

from ..models import FavoriteProduct
from ..serializers import FavoriteProductSerializer
from ..services import UserService

class FavoriteProductListView(generics.ListCreateAPIView):
    queryset = FavoriteProduct.objects.all()
    serializer_class = FavoriteProductSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
