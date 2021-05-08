from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import User
from ..models import AccountUser
from ..paginations import UserPagination
from ..serializers import UserReadSerializer
from ..serializers import UserWriteSerializer

class UserListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class_read = UserReadSerializer
    serializer_class_write = UserWriteSerializer
    pagination_class = UserPagination
    filterset_fields = ['user_name', 'email']

    def perform_create(self, serializer):
        user = serializer.save(account=self.request.user)
