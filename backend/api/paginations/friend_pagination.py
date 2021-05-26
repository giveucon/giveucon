from rest_framework.pagination import PageNumberPagination

class FriendPagination(PageNumberPagination):
    page_size = 10
