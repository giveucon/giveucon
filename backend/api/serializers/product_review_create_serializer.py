from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .review_write_serializer import ReviewWriteSerializer
from .product_review_read_serializer import ProductReviewReadSerializer
from ..models import ProductReview

class ProductReviewCreateSerializer(ModelSerializer):
    review = ReviewWriteSerializer()
    class Meta:
        model = ProductReview
        fields = '__all__'

    def create(self, validated_data):
        review_data = validated_data.pop('review')
        user = validated_data.pop('user')
        review = ReviewWriteSerializer(data=review_data)
        review.is_valid(raise_exception=True)
        with transaction.atomic():
            review = review.save(user=user)
            product_review = ProductReview.objects.create(review=review, **validated_data)
        return product_review

    def to_representation(self, instance):
        return ProductReviewReadSerializer(instance).data
