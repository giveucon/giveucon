import axios from 'axios';

import * as constants from '../constants';
import destroyCookie from 'utils/destroyCookie'
import getCookies from 'utils/getCookies'
import setCookie from 'utils/setCookie'

const requestVerifyTokens = async (session) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/verify/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        token: session.tokens.access_token,
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
    else if (error.request) {
      return {
        responseType: constants.RESPONSE_TYPE_REQUEST_ERROR,
        request: error.request
      }
    }
    else {
      return {
        responseType: constants.RESPONSE_TYPE_UNKNOWN_ERROR,
        message: error.message
      }
    }
  }
};

const requestRefreshTokens = async (session) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/refresh/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        refresh: session.tokens.refresh_token,
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
    else if (error.request) {
      return {
        responseType: constants.RESPONSE_TYPE_REQUEST_ERROR,
        request: error.request
      }
    }
    else {
      return {
        responseType: constants.RESPONSE_TYPE_UNKNOWN_ERROR,
        message: error.message
      }
    }
  }
};

export default async function getSession(context) {
  const cookies = getCookies(context);
  if (cookies.giveucon_session) {
    const session = JSON.parse(cookies.giveucon_session);
    const verifyTokensResponse = await requestVerifyTokens(session);
    if (verifyTokensResponse.status === 200) return session;
    else {
      const refreshTokenResponse = await requestRefreshTokens(session);
      if (refreshTokenResponse.status === 200) {
        const refreshedSession = {
          ...session,
          tokens: {
            'access_token': refreshTokenResponse.data.access,
            'refresh_token': refreshTokenResponse.data.refresh,
            'access_token_lifetime': refreshTokenResponse.data.access_lifetime,
            'refresh_token_lifetime': refreshTokenResponse.data.refresh_lifetime,
            'access_token_expiry': refreshTokenResponse.data.access_expiry,
            'refresh_token_expiry': refreshTokenResponse.data.refresh_expiry,
          }
        };
        setCookie(context, 'giveucon_session', JSON.stringify(refreshedSession), {
          maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
          path: process.env.NEXT_PUBLIC_COOKIE_PATH,
        })
        console.info('refresh.js : Token refreshed');
        console.info(refreshedSession);
        return refreshedSession;
      } else {
        destroyCookie(context, 'giveucon_session', {
          maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
          path: process.env.NEXT_PUBLIC_COOKIE_PATH,
        });
        return null;
      }
    }
  } else {
    return null;
  }
}
