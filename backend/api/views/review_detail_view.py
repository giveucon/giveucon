from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Review
from ..serializers import ReviewReadSerializer
from ..serializers import ReviewWriteSerializer

class ReviewDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class_read = ReviewReadSerializer
    serializer_class_write = ReviewWriteSerializer
