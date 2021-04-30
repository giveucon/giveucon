from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import ProductReview
from ..serializers import ProductReviewReadSerializer
from ..serializers import ProductReviewCreateSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class ProductReviewListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class_read = ProductReviewReadSerializer
    serializer_class_create = ProductReviewCreateSerializer

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
