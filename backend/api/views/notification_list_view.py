from rest_framework import generics

from ..models import Notification
from ..paginations import NotificationPagination
from ..serializers import NotificationReadSerializer
from ..serializers import NotificationCreateSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class NotificationListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class_read = NotificationReadSerializer
    serializer_class_create = NotificationCreateSerializer
    pagination_class = NotificationPagination
    filterset_fields = ['article__user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
