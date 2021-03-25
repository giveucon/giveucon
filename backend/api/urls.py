from django.urls import path, include
from .views import account_views, test_views

urlpatterns = [
    # Login
    # account_views.py
    path('account/login/', include('rest_auth.urls')),
    path('account/login/', include('allauth.urls')),
    path('account/registration/', include('rest_auth.registration.urls')),
    path('', include('django.contrib.auth.urls')),

    # Social Login
    # account_views.py
    path('account/login/kakao/', account_views.kakao_login, name='kakao_login'),
    path('account/login/kakao/callback/', account_views.kakao_callback, name='kakao_callback'),
    
    # Test
    # test_views.py
    path('test/hello/', test_views.hello),
]
