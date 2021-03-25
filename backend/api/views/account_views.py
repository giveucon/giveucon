import json, os, requests, urllib
from rest_auth.registration.views import SocialLoginView                   
from allauth.socialaccount.providers.kakao import views as kakao_views     
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from ..models import User


BASE_DIR = os.path.dirname(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__)))))

# Get secrets from JSON file
with open(os.path.join(BASE_DIR, 'giveucon\secrets.json'), 'rb') as secret_file:
    secrets = json.load(secret_file)

# Request authentication code
def kakao_login(request):
    app_rest_api_key = secrets['OAUTH']['KAKAO']["REST_API_KEY"]
    redirect_uri = secrets["MAIN_DOMAIN"] + "/api/account/login/kakao/callback"
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={app_rest_api_key}&redirect_uri={redirect_uri}&response_type=code"
    )
    

# Request access token
def kakao_callback(request):
    try:
        rest_api_key = secrets['OAUTH']['KAKAO']["REST_API_KEY"]
        redirect_uri = secrets["MAIN_DOMAIN"] + "/api/account/login/kakao/callback"
        user_token = request.GET.get("code")

        # Request access token
        token_request = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={user_token}"
        )
        token_response_json = token_request.json()
        error = token_response_json.get("error", None)
        if error is not None:
            raise KakaoException
        access_token = token_response_json.get("access_token")
        # refresh_token = token_response_json.get("refresh_token")
		
        # Request profile
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile_json = profile_request.json()

        # Parse profile to json
        kakao_account = profile_json.get("kakao_account")
        email = kakao_account.get("email", None)
        profile = kakao_account.get("profile")
        nickname = profile.get("nickname")
        profile_image = profile.get("thumbnail_image_url", None)

        data = {'access_token': access_token, 'user_token': user_token, 'profile_json': profile_json}
        return JsonResponse(data)

    except KakaoException:
        return HttpResponse('KakaoException')
