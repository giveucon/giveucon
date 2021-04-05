from django.utils import timezone
from rest_framework import generics

from ..models import Image
from ..serializers import ImageSerializer

class ImageListView(generics.ListCreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
