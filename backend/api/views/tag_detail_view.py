from rest_framework import generics

from ..models import Tag
from ..serializers import TagSerializer

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
