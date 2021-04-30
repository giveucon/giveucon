from rest_framework.serializers import ModelSerializer

from .product_serializer import ProductSerializer
from .review_read_serializer import ReviewReadSerializer
from ..models import ProductReview

class ProductReviewReadSerializer(ModelSerializer):
    product = ProductSerializer()
    review = ReviewReadSerializer()
    class Meta:
        model = ProductReview
        fields = '__all__'
