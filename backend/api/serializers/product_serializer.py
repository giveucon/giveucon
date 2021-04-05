from rest_framework.serializers import ModelSerializer
from ..models import Product
from django.conf import settings

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
