from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import StoreNotice
from ..paginations import StoreNoticePagination
from ..serializers import StoreNoticeReadSerializer
from ..serializers import StoreNoticeWriteSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class StoreNoticeListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = StoreNotice.objects.all()
    serializer_class_read = StoreNoticeReadSerializer
    serializer_class_write = StoreNoticeWriteSerializer
    pagination_class = StoreNoticePagination

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
