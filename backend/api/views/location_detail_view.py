from rest_framework import generics

from ..models import Location
from ..serializers import LocationSerializer

class LocationDetailView(generics.RetrieveAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
