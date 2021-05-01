from rest_framework.pagination import PageNumberPagination

class FavoriteProductPagination(PageNumberPagination):
    page_size = 6
