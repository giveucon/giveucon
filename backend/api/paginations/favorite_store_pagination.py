from rest_framework.pagination import PageNumberPagination

class FavoriteStorePagination(PageNumberPagination):
    page_size = 6
