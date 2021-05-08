from rest_framework import generics

from ..mixins import SerializerMixin
from ..models import User
from ..serializers import UserReadSerializer
from ..serializers import UserWriteSerializer

class UserDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class_read = UserReadSerializer
    serializer_class_write = UserWriteSerializer
