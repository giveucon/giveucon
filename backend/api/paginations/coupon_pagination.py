from rest_framework.pagination import PageNumberPagination

class CouponPagination(PageNumberPagination):
    page_size = 10
