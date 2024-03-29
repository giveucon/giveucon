from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import CentralNotice
from ..paginations import CentralNoticePagination
from ..serializers import CentralNoticeReadSerializer
from ..serializers import CentralNoticeWriteSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class CentralNoticeListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class_read = CentralNoticeReadSerializer
    serializer_class_write = CentralNoticeWriteSerializer
    pagination_class = CentralNoticePagination
    filterset_fields = ['article__user']
    ordering_fields = ['article__created_at']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
