from rest_framework.pagination import PageNumberPagination

class StoreReviewPagination(PageNumberPagination):
    page_size = 10
