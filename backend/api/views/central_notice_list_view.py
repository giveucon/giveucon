from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import CentralNotice
from ..serializers import CentralNoticeSerializer
from ..services import UserService

class CentralNoticeListView(generics.ListCreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class = CentralNoticeSerializer
    def create(self, request, *args, **kwargs):
        user = UserService.get_current_user(request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data)
