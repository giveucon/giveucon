from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .review_write_serializer import ReviewWriteSerializer
from .product_review_read_serializer import ProductReviewReadSerializer
from ..models import ProductReview

class ProductReviewUpdateSerializer(ModelSerializer):
    review = ReviewWriteSerializer()
    class Meta:
        model = ProductReview
        fields = '__all__'
        read_only_fields = ('product',)

    def update(self, instance, validated_data):
        review_data = validated_data.pop('review')
        review = ReviewWriteSerializer(instance.review, data=review_data, partial=True)
        review.is_valid(raise_exception=True)
        review.save()
        return instance

    def to_representation(self, instance):
        return ProductReviewReadSerializer(instance).data
