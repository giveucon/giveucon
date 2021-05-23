from rest_framework.pagination import PageNumberPagination

class ReportPagination(PageNumberPagination):
    page_size = 6
