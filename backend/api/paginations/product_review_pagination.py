from rest_framework.pagination import PageNumberPagination

class ProductReviewPagination(PageNumberPagination):
    page_size = 10
