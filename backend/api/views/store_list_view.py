from rest_framework import generics

from ..models import User, AccountUser, Store
from ..serializers import StoreSerializer
from ..services import UserService

class StoreListView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        images = self.request.data.getlist('images')
        serializer.save(user=user, images=images)
