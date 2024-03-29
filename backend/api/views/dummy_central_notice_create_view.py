from rest_framework import generics

from ..models import CentralNotice
from ..serializers import DummyCentralNoticeWriteSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class DummyCentralNoticeCreateView(SerializerMixin, generics.CreateAPIView):
    queryset = CentralNotice.objects.all()
    serializer_class_create = DummyCentralNoticeWriteSerializer
