from rest_framework import generics

from ..models import User, AccountUser, Store
from ..serializers import StoreSerializer

class StoreListView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
