from rest_framework import generics

from ..models import User, AccountUser, Store
from ..serializers import StoreSerializer

class StoreListView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def get_queryset(self):
        return Store.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.DATA)

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        item = Store.objects.create(
            name = serializer.data['name'],
            description = serializer.data['description'],
            owner = get_object_or_404(AccountUser, account=request.user).user
        )

        result = StoreSerializer(item)
        return Response(result.data, status=status.HTTP_201_CREATED)
