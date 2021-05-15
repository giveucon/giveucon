from rest_framework import generics

from ..models import StoreLocation
from ..serializers import StoreLocationSerializer

class StoreLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StoreLocation.objects.all()
    serializer_class = StoreLocationSerializer
