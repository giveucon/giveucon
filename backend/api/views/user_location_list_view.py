from rest_framework import generics

from ..models import UserLocation
from ..serializers import UserLocationSerializer
from ..services import UserService

class UserLocationListView(generics.ListCreateAPIView):
    queryset = UserLocation.objects.all()
    serializer_class = UserLocationSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
