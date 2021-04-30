from rest_framework import generics

from ..models import ProductReview
from ..serializers import ProductReviewReadSerializer
from ..serializers import ProductReviewUpdateSerializer
from ..mixins import SerializerMixin

class ProductReviewDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductReview.objects.all()
    serializer_class_read = ProductReviewReadSerializer
    serializer_class_update = ProductReviewUpdateSerializer
