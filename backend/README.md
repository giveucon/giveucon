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
http://127.0.0.1:3000/api/auth/callback/kakao
http://localhost:3000/api/auth/callback/kakao
```

Go to Product Settings > Kakao Login > Consent Items and set following states to Required or Optional consent:

```
Profile Info
Email
```

Go to Product Settings > Kakao Login > Security and get Client Secret

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
python manage.py makemigration
python manage.py migrate
```

Create superuser:

```
python manage.py createsuperuser
```


## Create Secret File

Move to Backend core application directory:

```
cd giveucon
```

then create secrets.py:

```
DJANGO_BASE_URL = "http://127.0.0.1:8000"
DJANGO_DEBUG = True
DJANGO_SIMPLE_JWT_SIGNING_KEY = "some_string_here"
DJANGO_SECRET_KEY = "your_django_secert_key_here"
```

Move back to backend root directory:

```
cd ..
```

## Launch

Launch backend:

```
cd backend
python manage.py runserver
```


## Setting Up Backend

Go to backend Django admin page:

```
http://127.0.0.1:8000/admin
```

Go to Sites tab, then modify domain name and display name of

```
example.com
```

to

```
127.0.0.1:8000
```

Go to Social applications tab and create new application

```
Provider: Kakao
Name: Kakao
Client id: [your_kakao_app_rest_api_key_here]
Secret key: [some_string_here]
Sites - Chosen sites: 127.0.0.1:8000
```
