from rest_framework.pagination import PageNumberPagination

class CentralNoticePagination(PageNumberPagination):
    page_size = 10
