from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..mixins import SerializerMixin
from ..models import Review
from ..serializers import ReviewReadSerializer
from ..serializers import ReviewWriteSerializer
from ..services import UserService

class ReviewListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class_read = ReviewReadSerializer
    serializer_class_write = ReviewWriteSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
