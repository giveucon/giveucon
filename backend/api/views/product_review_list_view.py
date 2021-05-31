from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import ProductReview
from ..paginations import ProductReviewPagination
from ..serializers import ProductReviewReadSerializer
from ..serializers import ProductReviewCreateSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class ProductReviewListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = ProductReview.objects.all()
    pagination_class = ProductReviewPagination
    serializer_class_read = ProductReviewReadSerializer
    serializer_class_create = ProductReviewCreateSerializer
    filterset_fields = ['product', 'product__store', 'product__store__user', 'review__article__user']
    ordering_fields = ['review__article__created_at']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
