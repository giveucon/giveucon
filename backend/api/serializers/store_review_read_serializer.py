from rest_framework.serializers import ModelSerializer

from .store_read_serializer import StoreReadSerializer
from .review_read_serializer import ReviewReadSerializer
from ..models import StoreReview

class StoreReviewReadSerializer(ModelSerializer):
    store = StoreReadSerializer()
    review = ReviewReadSerializer()
    class Meta:
        model = StoreReview
        fields = '__all__'
