from rest_framework import generics

from ..models import Notification
from ..mixins import SerializerMixin
from ..serializers import NotificationReadSerializer

class NotificationDetailView(generics.RetrieveDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationReadSerializer
