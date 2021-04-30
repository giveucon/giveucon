from rest_framework import generics

from ..models import StoreReview
from ..serializers import StoreReviewReadSerializer
from ..serializers import StoreReviewWriteSerializer
from ..mixins import SerializerMixin

class StoreReviewDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = StoreReview.objects.all()
    serializer_class_read = StoreReviewReadSerializer
    serializer_class_write = StoreReviewWriteSerializer
