from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response

from ..models import StoreReview
from ..paginations import StoreReviewPagination
from ..serializers import StoreReviewReadSerializer
from ..serializers import StoreReviewCreateSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class StoreReviewListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = StoreReview.objects.all()
    pagination_class = StoreReviewPagination
    serializer_class_read = StoreReviewReadSerializer
    serializer_class_create = StoreReviewCreateSerializer
    filterset_fields = ['store', 'review__article__user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
