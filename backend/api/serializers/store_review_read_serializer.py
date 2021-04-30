from rest_framework.serializers import ModelSerializer

from .store_serializer import StoreSerializer
from .review_read_serializer import ReviewReadSerializer
from ..models import StoreReview

class StoreReviewReadSerializer(ModelSerializer):
    store = StoreSerializer()
    review = ReviewReadSerializer()
    class Meta:
        model = StoreReview
        fields = '__all__'
