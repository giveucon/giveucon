import axios from 'axios';
import { parseCookies } from 'nookies'

const requestVerifyTokens = async (session) => {
  try {
    const response = await axios({
      url: 'api/rest-auth/token/verify/',
      method: 'post',
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data: {
        token: session.access_token,
      }
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export default async function verifySession() {
  const cookies = parseCookies()
  if (cookies.giveucon) {
    const session = JSON.parse(cookies.giveucon);
    const verifyTokensResponse = await requestVerifyTokens(session);
    if (verifyTokensResponse.status === 200) return session;
  }
  return null;
}
