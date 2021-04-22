import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'
import axios from 'axios';

const getTokens = async (code) => {
  try {
    const response = await axios({
      url: 'oauth/token',
      method: 'post',
      baseURL: 'https://kauth.kakao.com/',
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY,
        redirect_uri: process.env.NEXT_PUBLIC_BASE_URL + 'session/oauth/kakao/callback/',
        code,
        client_secret: process.env.NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET,
      }
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const socialLogin = async (access_token) => {
  try {
    const response = await axios({
      url: 'api/social/login/kakao/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        access_token,
      }
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const socialLoginRefresh = async (refresh_token) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/refresh/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        refresh: refresh_token,
      }
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export async function getServerSideProps(ctx) {
  const tokenResponse = await getTokens(ctx.query.code);
  const loginResponse = await socialLogin(tokenResponse.data.access_token);
  const loginRefreshResponse = await socialLoginRefresh(loginResponse.data.refresh_token);
  return {
    props: {loginRefresh: loginRefreshResponse.data}
  };
}

export default function Callback({loginRefresh}) {
  const router = useRouter();
  const giveuconToken = {
    'access_token': loginRefresh.access,
    'refresh_token': loginRefresh.refresh,
    'access_token_lifetime': loginRefresh.access_lifetime,
    'refresh_token_lifetime': loginRefresh.refresh_lifetime,
    'access_token_expiry': loginRefresh.access_expiry,
    'refresh_token_expiry': loginRefresh.refresh_expiry,
  };
  useEffect(() => {
    setCookie(null, 'giveucon', JSON.stringify(giveuconToken), {
      maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
      path: process.env.NEXT_PUBLIC_COOKIE_PATH,
    });
    router.push('/');
  });
  return null;
}
