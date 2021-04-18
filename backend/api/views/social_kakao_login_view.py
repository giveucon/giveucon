from allauth.socialaccount.providers.kakao.views import KakaoOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings

class SocialKakaoLoginView(SocialLoginView):
  authentication_classes = [] # disable authentication, make sure to override `allowed origins` in settings.py in production!
  adapter_class = KakaoOAuth2Adapter
  callback_url = settings.DJANGO_FRONTEND_BASE_URL  # frontend application url
  client_class = OAuth2Client
