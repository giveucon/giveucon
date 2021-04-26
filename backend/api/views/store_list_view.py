from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics

from ..models import User, Store
from ..paginations import StorePagination
from ..serializers import StoreSerializer
from ..services import UserService

class StoreListView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    pagination_class = StorePagination

    def get_queryset(self):
        queryset = Store.objects.all()
        user = self.request.query_params.get('user')
        if user:
            queryset = queryset.filter(user__id=user)
        return queryset

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        images = self.request.data.getlist('images')
        serializer.save(user=user, images=images)
