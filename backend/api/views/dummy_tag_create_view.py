from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import Tag
from ..serializers import DummyTagCreateSerializer

class DummyTagCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = Tag.objects.all()
    serializer_class_create = DummyTagCreateSerializer
