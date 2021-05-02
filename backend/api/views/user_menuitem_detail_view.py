from rest_framework import generics

from ..models import UserMenuItem
from ..serializers import UserMenuItemSerializer

class UserMenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserMenuItem.objects.all()
    serializer_class = UserMenuItemSerializer
