from rest_framework.serializers import ModelSerializer

from .product_read_serializer import ProductReadSerializer
from .review_read_serializer import ReviewReadSerializer
from ..models import ProductReview

class ProductReviewReadSerializer(ModelSerializer):
    product = ProductReadSerializer()
    review = ReviewReadSerializer()
    class Meta:
        model = ProductReview
        fields = '__all__'
