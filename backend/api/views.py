import json, os, requests, urllib
from rest_auth.registration.views import SocialLoginView                   
from allauth.socialaccount.providers.kakao import views as kakao_views     
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.shortcuts import redirect , render
from django.http import HttpResponse
from .models import User  

# giveucon/accounts
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Get secrets from JSON file
with open(os.path.join(BASE_DIR, 'giveucon\secrets.json'), 'rb') as secret_file:
    secrets = json.load(secret_file)


# Hello world!
def hello(request):
    return HttpResponse('hello')

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
        app_rest_api_key = secrets['OAUTH']['KAKAO']["REST_API_KEY"]
        redirect_uri = secrets["MAIN_DOMAIN"] + "/api/account/login/kakao/callback"
        user_token = request.GET.get("code")

        # post request
        token_request = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={app_rest_api_key}&redirect_uri={redirect_uri}&code={user_token}"
        )
        token_response_json = token_request.json()
        error = token_response_json.get("error", None)
        
        # if there is an error from token_request
        if error is not None:
            raise KakaoException()
        access_token = token_response_json.get("access_token")
		
        # post request
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile_json = profile_request.json()

        # parsing profile json
        kakao_account = profile_json.get("kakao_account")
        email = kakao_account.get("email", None)
        profile = kakao_account.get("profile")
        nickname = profile.get("nickname")
        profile_image = profile.get("thumbnail_image_url")

        try:
            user_in_db = User.objects.get(email=email)
            # User already exists
            if user_in_db:
                return HttpResponse('KakaoAccountAlreadyExistException')
        except User.DoesNotExist as exception:
            return HttpResponse('Sign up!')

        # Redirect to main page
        return redirect(secrets["MAIN_DOMAIN"])

    except KakaoException:
        return HttpResponse('KakaoException')
