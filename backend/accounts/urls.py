from django.urls import path
from . import views


urlpatterns = [
    path('kakao/login/', views.kakao_login, name='kakao_login'),
    path('kakao/login/callback/', views.kakao_callback, name='kakao_callback'),
    path('kakao/login/todjango/', views.KakaoLoginToDjango.as_view(), name='kakao_login_todjango'),
]
