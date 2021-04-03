from django.urls import path, include
from .views import *

urlpatterns = [
    # Social views
    path("social/login/kakao/", SocialKakaoLoginView.as_view()),

    # User views
    path('users/', UserListView.as_view()),
    path('users/current', CurrentUserDetailView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),

    # Test views
    path('ping/', PingView.ping),
]
