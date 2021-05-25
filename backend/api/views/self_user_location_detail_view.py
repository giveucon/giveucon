from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import UserLocation
from ..serializers import UserLocationSerializer
from ..services import UserService

class SelfUserLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserLocation.objects.all()
    serializer_class = UserLocationSerializer

    def get_object(self):
        user = UserService.get_current_user(self.request)
        return self.get_queryset().filter(user=user.pk).first()

    def perform_update(self, serializer):
        user = UserService.get_current_user(self.request)
        instance = serializer.save(user=user)
