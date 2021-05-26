from rest_framework.pagination import PageNumberPagination

class StorePagination(PageNumberPagination):
    page_size = 10
