from django.urls import path, include
from .views import *

urlpatterns = [
    # Hello world!
    path('hello/', hello),

    # Login
    path('account/login/', include('rest_auth.urls')),
    path('account/registration/', include('rest_auth.registration.urls')),
    path('account/login/', include('allauth.urls')),
    path('', include('django.contrib.auth.urls')),

    # Social Login
    path('account/login/kakao/', kakao_login, name='kakao_login'),
    path('account/login/kakao/callback/', kakao_callback, name='kakao_callback'),
]
