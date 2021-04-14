from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import Review
from ..serializers import ReviewSerializer
from ..services import UserService

class ReviewListView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
