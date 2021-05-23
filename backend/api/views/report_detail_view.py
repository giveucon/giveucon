from rest_framework import generics

from ..models import Report
from ..mixins import SerializerMixin
from ..serializers import ReportReadSerializer

class ReportDetailView(generics.RetrieveDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportReadSerializer
