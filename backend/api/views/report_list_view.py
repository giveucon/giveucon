from rest_framework import generics

from ..models import Report
from ..paginations import ReportPagination
from ..serializers import ReportReadSerializer
from ..serializers import ReportCreateSerializer
from ..services import UserService
from ..mixins import SerializerMixin

class ReportListView(SerializerMixin, generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class_read = ReportReadSerializer
    serializer_class_create = ReportCreateSerializer
    pagination_class = ReportPagination
    filterset_fields = ['article__user']

    def perform_create(self, serializer):
        user = UserService.get_current_user(self.request)
        serializer.save(user=user)
