from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import StoreNotice
from ..serializers import StoreNoticeSerializer
from ..services import UserService

class StoreNoticeListView(generics.ListCreateAPIView):
    queryset = StoreNotice.objects.all()
    serializer_class = StoreNoticeSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)