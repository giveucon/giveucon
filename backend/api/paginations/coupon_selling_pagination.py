from rest_framework.pagination import PageNumberPagination

class CouponSellingPagination(PageNumberPagination):
    page_size = 10
