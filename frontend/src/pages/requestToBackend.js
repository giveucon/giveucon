import axios from 'axios';

const jsonRequest = async (session, url, method, data, params) => {
  try {
    const response = await axios({
      url,
      method,
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data,
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params,
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const multipartRequest = async (session, url, method, data, params) => {
  try {
    const response = await axios({
      url,
      method,
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      data,
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      params,
    })
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export default async function requestToBackend(session, url, method, contentType, data=null, params=null) {
  if (contentType === 'json') return await jsonRequest(session, url, method, data, params);
  else if (contentType === 'multipart') return await multipartRequest(session, url, method, data, params);
  else throw new Error();
}
