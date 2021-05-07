# Give-U-Con Frontend


## Installation

Move to frontend directory:

```
cd [project_root_directory_here]/frontend
```

Install Node packages:

> using npm: 
> ```
> npm install
> ```

> using yarn: 
> ```
> yarn install
> ```


## Create Secret File

Create .env.local:

```
NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:8000/
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000/
NEXT_PUBLIC_COOKIE_MAX_AGE=2592000
NEXT_PUBLIC_COOKIE_PATH=/
NEXT_PUBLIC_COUPON_OTP_REFRESH_INTERVAL=30000
NEXT_PUBLIC_COUPON_QR_REFRESH_INTERVAL=100
NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET=your_kakao_app_client_secret_here
NEXT_PUBLIC_KAKAO_APP_JAVASCRIPT_KEY=your_kakao_app_javascript_key_here
NEXT_PUBLIC_KAKAO_APP_REST_API_KEY=your_kakao_app_rest_api_key_here
NEXT_PUBLIC_KAKAO_APP_URL_PARAMETER_STATE=some_random_string
```


## Launch

Launch frontend:

> using npm: 
> ```
> npm run dev
> ```

> using yarn: 
> ```
> yarn start
> ```
