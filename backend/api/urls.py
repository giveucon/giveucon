from django.urls import path, include
from .views import *


urlpatterns = [
    # Social views
    path("social/login/kakao/", SocialKakaoLoginView.as_view()),

    # User views
    path('current-user/', CurrentUserDetailView.as_view()),
    path('users/', UserListView.as_view()),
    path('users/<str:pk>/', UserDetailView.as_view()),

    # Test views
    path('ping/', PingView.ping),
]
