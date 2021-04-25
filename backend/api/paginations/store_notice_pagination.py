from rest_framework.pagination import PageNumberPagination

class StoreNoticePagination(PageNumberPagination):
    page_size = 6
