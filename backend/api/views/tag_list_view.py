from rest_framework import generics

from ..models import Tag
from ..serializers import TagSerializer

class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filterset_fields = ['name']
