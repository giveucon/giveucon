from django.urls import path, include
from .views import KakaoLoginView

urlpatterns = [
  path("social/login/kakao/", KakaoLoginView.as_view(), name = "kakao"),
]
