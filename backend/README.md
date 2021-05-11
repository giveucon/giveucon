# Give-U-Con Backend


## Create Kakao Application

Go to Kakao developer page and create application:
```
https://developers.kakao.com/console/app
```

Create application:
```
App name: giveucon
Company name: giveucon
```

Go to App Settings > Platform and create Web site domains:

```
http://127.0.0.1:3000
http://localhost:3000
```

Go to Product Settings > Kakao Login and create Redirect URI:

```
http://127.0.0.1:3000/oauth/kakao/login/callback/
http://localhost:3000/oauth/kakao/login/callback/
```

Go to Product Settings > Kakao Login > Consent Items and set following states to Required or Optional consent:

```
Profile Info
Email
```

Go to Product Settings > Kakao Login > Security and get Client Secret

Go to Product Settings > Kakao Login > Advance and create Logout Redirect URI:

```
http://127.0.0.1:3000/oauth/kakao/logout/callback/
http://localhost:3000/oauth/kakao/logout/callback/
```


## Create Twilio account

Go to Twilio page and create account:
```
https://www.twilio.com/
```

Create you trial number, then get these codes:
```
Account SID
Auth Token
Trial Number
```



## Create Secret File

Move to Backend core application directory:

```
cd [project_root_directory_here]/backend/giveucon
```

then create secrets.py:

```
DJANGO_ADMIN_USERNAME = 'admin'
DJANGO_ADMIN_EMAIL = 'admin@giveucon.com'
DJANGO_ADMIN_PASSWORD = 'your_admin_password_here'
DJANGO_BASE_URL = 'http://127.0.0.1:8000'
DJANGO_DEBUG = True
DJANGO_FRONTEND_BASE_URL = 'http://127.0.0.1:3000'
DJANGO_KAKAO_APP_REST_API_KEY = 'your_kakao_app_rest_api_key_here'
DJANGO_SIMPLE_JWT_SIGNING_KEY = 'some_string_here'
DJANGO_SECRET_KEY = 'your_django_secert_key_here'
DJANGO_TWILIO_SID = 'your_twilio_sid_here'
DJANGO_TWILIO_TOKEN = 'your_twilio_token_here'
DJANGO_TWILIO_SENDER = 'your_twilio_trial_number_here'
DJANGO_PAYPAL_CLIENT_ID = 'your paypal client id'
DJANGO_PAYPAL_CLIENT_SECRET = 'your paypal client secret'

```

Move back to backend root directory:

```
cd ..
```


## Installation

Move to backend directory:

```
cd [project_root_directory_here]/backend
```

Setup python virtual environment:

```
python -m venv venv
```

Activate python virtual environment:

> on Linux: 
> ```
> . venv/bin/activate
> ```

> on Windows command prompt: 
> ```
> . venv\Scripts\activate.bat
> ```

> on Windows PowerShell:
> ```
> . venv\Scripts\Activate.ps1
> ```

Install python requirements:

```
cd backend
pip install -r requirements.txt
```

Make Django migrations and migrate:

```
python manage.py makemigrations
python manage.py migrate
```

Create superuser:

```
python manage.py createsuperuser
```

Then create a superuser like this:

```
username: admin
email: admin@giveucon.com
password: your_admin_password_here
password: your_admin_password_here
```

Set Django social applications:

```
python manage.py setsocialapplications
```

## Launch

Launch backend:

```
cd [project_root_directory_here]/backend
python manage.py runserver
```
