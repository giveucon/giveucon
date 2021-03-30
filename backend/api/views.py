from allauth.socialaccount.providers.kakao.views import KakaoOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings

class KakaoLoginView(SocialLoginView):
  authentication_classes = [] # disable authentication, make sure to override `allowed origins` in settings.py in production!
  adapter_class = KakaoOAuth2Adapter
  callback_url = "http://localhost:3000"  # frontend application url
  client_class = OAuth2Client