from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import User
from ..serializers import UserReadSerializer
from ..serializers import UserWriteSerializer
from ..services import UserService

class SelfUserDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all() # is this queryset needed? or properly used?
    serializer_class_read = UserReadSerializer
    serializer_class_write = UserWriteSerializer

    def retrieve(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        return Response(self.get_serializer(user).data)

    def update(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
