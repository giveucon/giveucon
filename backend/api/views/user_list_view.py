from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response

from ..models import User

from ..models import AccountUser
from ..serializers import UserSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            user = serializer.save()
            AccountUser.objects.create(account=request.user, user=user)
        return Response(serializer.data)
