from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import User
from ..serializers import UserSerializer
from ..services import UserService

class SelfUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all() # is this queryset needed? or properly used?
    serializer_class = UserSerializer
    def retrieve(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        return Response(self.get_serializer(user).data)

    def update(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
