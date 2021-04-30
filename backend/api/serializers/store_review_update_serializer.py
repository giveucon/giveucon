from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .review_write_serializer import ReviewWriteSerializer
from .store_review_read_serializer import StoreReviewReadSerializer
from ..models import StoreReview

class StoreReviewUpdateSerializer(ModelSerializer):
    review = ReviewWriteSerializer()
    class Meta:
        model = StoreReview
        fields = '__all__'
        read_only_fields = ('store',)

    def update(self, instance, validated_data):
        review_data = validated_data.pop('review')
        review = ReviewWriteSerializer(instance.review, data=review_data, partial=True)
        review.is_valid(raise_exception=True)
        review.save()
        return instance

    def to_representation(self, instance):
        return StoreReviewReadSerializer(instance).data
