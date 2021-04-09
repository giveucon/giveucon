from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import AccountUser, CentralNotice
from ..serializers import CentralNoticeSerializer

class CentralNoticeListView(generics.ListCreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class = CentralNoticeSerializer
    def create(self, request, *args, **kwargs):
        user = get_object_or_404(AccountUser, account=request.user).user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data)
