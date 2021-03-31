from django.urls import path, include
from .views import social_views, test_views, user_views


urlpatterns = [
    # Social views
    path("social/login/kakao/", social_views.KakaoLoginView.as_view(), name = "kakao"),

    # Test views
    path('test/hello/', test_views.hello),

    # User views
    path('users/', user_views.UserList.as_view()),
    path('users/<int:pk>/', user_views.UserDetail.as_view()),
    path('current-user/', user_views.CurrentUserDetail.as_view()),
]
