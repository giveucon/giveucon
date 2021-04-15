from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response

from ..models import User

from ..models import AccountUser
from ..serializers import UserSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            user = serializer.save()
            AccountUser.objects.create(account=self.request.user, user=user)
