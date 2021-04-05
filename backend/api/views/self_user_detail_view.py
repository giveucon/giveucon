from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import User
from ..models import AccountUser
from ..serializers import UserSerializer

class SelfUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all() # is this queryset needed? or properly used?
    serializer_class = UserSerializer
    def retrieve(self, request, *args, **kwargs):
        user = get_object_or_404(AccountUser, account=request.user).user
        return Response(self.get_serializer(user).data)

    def update(self, request, *args, **kwargs):
        user = get_object_or_404(AccountUser, account=request.user).user
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
