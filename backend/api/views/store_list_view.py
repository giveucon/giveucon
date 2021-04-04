from rest_framework import generics

from ..models import User, AccountUser, Store
from ..serializers import StoreSerializer

class StoreListView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    '''
    def create(self, request, *args, **kwargs):
        #serializer = self.get_serializer(data=request.data)
        #serializer.is_valid(raise_exception=True)
        #store = serializer.save()
        #return Response(serializer.data)
        request.data['private_key'] = 'abcd'
        request.data['public_key'] = 'abcd'
        super(self, request, *args, **kwargs)
    '''
