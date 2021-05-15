from rest_framework import generics

from ..models import UserLocation
from ..serializers import UserLocationSerializer

class UserLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserLocation.objects.all()
    serializer_class = UserLocationSerializer
