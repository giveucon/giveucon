from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import CentralNotice
from ..serializers import CentralNoticeSerializer
from ..services import UserService

class CentralNoticeListView(generics.ListCreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class = CentralNoticeSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
