from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response

from ..models import User
from ..models import AccountUser
from ..paginations import UserPagination
from ..serializers import UserSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UserPagination
    filterset_fields = ['user_name', 'email']

    def perform_create(self, serializer):
        with transaction.atomic():
            user = serializer.save()
            AccountUser.objects.create(account=self.request.user, user=user)
