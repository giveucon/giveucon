from rest_framework import generics

from ..models import CouponSelling
from ..mixins import SerializerMixin
from ..serializers import CouponSellingReadSerializer
from ..serializers import CouponSellingUpdateSerializer
from ..services import UserService

class CouponSellingDetailView(SerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = CouponSelling.objects.all()
    serializer_class_read = CouponSellingReadSerializer
    serializer_class_update = CouponSellingUpdateSerializer
    def perform_update(self, serializer):
        user = UserService.get_current_user(self.request)
        instance = serializer.save(user=user)
