import axios from 'axios';
import { parseCookies, setCookie } from 'nookies'

const requestRefreshTokens = async (session) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/refresh/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        refresh: session.refresh_token,
      }
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export default async function refreshSession() {
  const cookies = parseCookies()
  if (cookies.giveucon) {
    const session = JSON.parse(cookies.giveucon);
    const loginRefreshResponse = await requestRefreshTokens(session);
    const giveuconToken = {
      'access_token': loginRefreshResponse.data.access,
      'refresh_token': loginRefreshResponse.data.refresh,
      'access_token_lifetime': loginRefreshResponse.data.access_lifetime,
      'refresh_token_lifetime': loginRefreshResponse.data.refresh_lifetime,
      'access_token_expiry': loginRefreshResponse.data.access_expiry,
      'refresh_token_expiry': loginRefreshResponse.data.refresh_expiry,
    };
    setCookie(null, 'giveucon', JSON.stringify(giveuconToken), {
      maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
      path: process.env.NEXT_PUBLIC_COOKIE_PATH,
    })
    console.log('refresh.js : Token refreshed');
    console.log(giveuconToken);
    return giveuconToken;
  }
  return null;
}
