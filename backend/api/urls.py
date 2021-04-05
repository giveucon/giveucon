from django.urls import path, include
from .views import *

urlpatterns = [
    # Social views
    path("social/login/kakao/", SocialKakaoLoginView.as_view()),

    path('accounts/', AccountListView.as_view()),

    # User views
    path('users/', UserListView.as_view()),
    path('users/self', SelfUserDetailView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),

    # Store views
    path('stores/', StoreListView.as_view()),
    path('stores/<int:pk>/', StoreDetailView.as_view()),

    path('products/', ProductListView.as_view()),
    path('products/<int:pk>', ProductDetailView.as_view()),

    path('images/', ImageListView.as_view()),
    path('images/<int:pk>', ImageDetailView.as_view()),

    # Test views
    path('ping/', PingView.ping),
]
