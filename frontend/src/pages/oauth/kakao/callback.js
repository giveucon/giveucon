import React, { useEffect } from 'react';
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
        redirect_uri: process.env.NEXTAUTH_URL + 'oauth/kakao/callback/',
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
  if (ctx.res) {
    const tokenResponse = await getTokens(ctx.query.code);
    const loginResponse = await socialLogin(tokenResponse.data.access_token);
    console.log(loginResponse.data);
    const loginRefreshResponse = await socialLoginRefresh(loginResponse.data.refresh_token);
    
    return { 
      props: {
        loginRefreshResponse
      } 
    };
  }
}

export default function Callback({ loginRefreshResponse }) {
  useEffect(() => {
    console.log(loginRefreshResponse);
    const backendToken = {
      'access_token': loginRefreshResponse.data.access,
      'refresh_token': loginRefreshResponse.data.refresh,
      'access_token_lifetime': loginRefreshResponse.data.access_lifetime,
      'refresh_token_lifetime': loginRefreshResponse.data.refresh_lifetime,
      'access_token_expiry': loginRefreshResponse.data.access_expiry,
      'refresh_token_expiry': loginRefreshResponse.data.refresh_expiry,
    };
    localStorage.clear();
    localStorage.setItem('giveucon', JSON.stringify(backendToken));
    console.log(JSON.parse(localStorage.getItem('giveucon')));
  }, [])
  return null;
}
