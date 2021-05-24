import axios from 'axios';

import * as constants from 'constants';
import setCookie from 'utils/setCookie';

const getTokens = async (code) => {
  try {
    const response = await axios({
      url: 'oauth/token',
      method: 'post',
      baseURL: 'https://kauth.kakao.com/',
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}oauth/kakao/login/callback/`,
        code,
        client_secret: process.env.NEXT_PUBLIC_KAKAO_APP_CLIENT_SECRET,
      }
    })
    return {
      responseType: constants.RESPONSE_TYPE_OK,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        responseType: constants.RESPONSE_TYPE_RESPONSE_ERROR,
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      }
    }
    if (error.request) {
      return {
        responseType: constants.RESPONSE_TYPE_REQUEST_ERROR,
        request: error.request
      }
    }

      return {
        responseType: constants.RESPONSE_TYPE_UNKNOWN_ERROR,
        message: error.message
      }

  }
};

const socialLogin = async (accessToken) => {
  try {
    const response = await axios({
      url: 'api/social/login/kakao/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        access_token: accessToken,
      }
    })
    return {
      responseType: constants.RESPONSE_TYPE_OK,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        responseType: constants.RESPONSE_TYPE_RESPONSE_ERROR,
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      }
    }
    if (error.request) {
      return {
        responseType: constants.RESPONSE_TYPE_REQUEST_ERROR,
        request: error.request
      }
    }

      return {
        responseType: constants.RESPONSE_TYPE_UNKNOWN_ERROR,
        message: error.message
      }

  }
};

const socialLoginRefresh = async (refreshToken) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/refresh/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        refresh: refreshToken,
      }
    })
    return {
      responseType: constants.RESPONSE_TYPE_OK,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        responseType: constants.RESPONSE_TYPE_RESPONSE_ERROR,
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      }
    }
    if (error.request) {
      return {
        responseType: constants.RESPONSE_TYPE_REQUEST_ERROR,
        request: error.request
      }
    }

      return {
        responseType: constants.RESPONSE_TYPE_UNKNOWN_ERROR,
        message: error.message
      }

  }
};

export async function getServerSideProps(context) {
  const tokenResponse = await getTokens(context.query.code);
  const loginResponse = await socialLogin(tokenResponse.data.access_token);
  const loginRefreshResponse = await socialLoginRefresh(loginResponse.data.refresh_token);

  const session = {
    tokens: {
      'access_token': loginRefreshResponse.data.access,
      'refresh_token': loginRefreshResponse.data.refresh,
      'access_token_lifetime': loginRefreshResponse.data.access_lifetime,
      'refresh_token_lifetime': loginRefreshResponse.data.refresh_lifetime,
      'access_token_expiry': loginRefreshResponse.data.access_expiry,
      'refresh_token_expiry': loginRefreshResponse.data.refresh_expiry,
    }
  };
  setCookie(context, 'giveucon_session', JSON.stringify(session), {
    maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
    path: process.env.NEXT_PUBLIC_COOKIE_PATH,
  })

  return {
    redirect: {
      destination: process.env.NEXT_PUBLIC_BASE_URL,
      permanent: false
    }
  }
}

export default function Callback() {

}
