from rest_framework import generics

from ..models import StoreLocation
from ..serializers import StoreLocationSerializer

class StoreLocationListView(generics.ListCreateAPIView):
    queryset = StoreLocation.objects.all()
    serializer_class = StoreLocationSerializer
    filterset_fields = ['store']
