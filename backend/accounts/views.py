from django.shortcuts import redirect
from django.conf import settings
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.http import JsonResponse   
import requests, os, sys

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from api.models import User


BASE_URL = getattr(settings, 'BASE_URL')
KAKAO_CALLBACK_URI = BASE_URL + '/accounts/kakao/callback/'

class KaKaoException(Exception):
    pass

def kakao_login(request):
    rest_api_key = getattr(settings, 'KAKAO_REST_API_KEY')
    redirect_uri = KAKAO_CALLBACK_URI
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={rest_api_key}&redirect_uri={redirect_uri}&response_type=code"
    )
    
def kakao_callback(request):
    try:
        rest_api_key = getattr(settings, 'KAKAO_REST_API_KEY')
        redirect_uri = KAKAO_CALLBACK_URI
        code = request.GET.get("code")
        token_request = requests.get(f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}")
        token_request_json = token_request.json()
        error = token_request_json.get("error")
        if error is not None:
            raise KaKaoException()
        access_token = token_request_json.get("access_token")
        # profile_request = requests.get("https://kapi.kakao.com/v2/user/me", headers={"Authorization" : f"Bearer {access_token}"})
        # profile_json = profile_request.json()
        # kakao_account = profile_json.get('kakao_account')
        # profile = kakao_account.get("profile")
        # nickname = profile.get("nickname")
        data = {'access_token' : access_token, 'code' : code}
        accept = requests.post(
            BASE_URL + "/accounts/kakao/login/finish/", data=data
        )
        accept_json = accept.json()
        error = accept_json.get("error")
        if error is not None:
            raise KaKaoException()
        return JsonResponse(accept_json)
    except KaKaoException:
        return redirect('/error')
    
class KakaoLogin(SocialLoginView):
    adapter_class = kakao_view.KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = KAKAO_CALLBACK_URI
