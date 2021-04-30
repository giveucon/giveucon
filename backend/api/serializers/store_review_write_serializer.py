from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .review_write_serializer import ReviewWriteSerializer
from .store_review_read_serializer import StoreReviewReadSerializer
from ..models import StoreReview

class StoreReviewWriteSerializer(ModelSerializer):
    review = ReviewWriteSerializer()
    class Meta:
        model = StoreReview
        fields = '__all__'

    def create(self, validated_data):
        review_data = validated_data.pop('review')
        user = validated_data.pop('user')
        review = ReviewWriteSerializer(data=review_data)
        review.is_valid(raise_exception=True)
        with transaction.atomic():
            review = review.save(user=user)
            store_review = StoreReview.objects.create(review=review, **validated_data)
        return store_review

    def update(self, instance, validated_data):
        review_data = validated_data.pop('review')
        review = ReviewWriteSerializer(instance.review, data=review_data, partial=True)
        review.is_valid(raise_exception=True)
        review.save()
        return instance

    def to_representation(self, instance):
        return StoreReviewReadSerializer(instance).data
