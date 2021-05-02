from rest_framework import generics

from ..models import UserMenuItem
from ..serializers import UserMenuItemSerializer
from ..services import UserService

class UserMenuItemListView(generics.ListCreateAPIView):
    queryset = UserMenuItem.objects.all()
    serializer_class = UserMenuItemSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
