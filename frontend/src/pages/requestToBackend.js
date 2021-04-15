import axios from 'axios';
import toast from 'react-hot-toast';

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
  let response = null;
  if (contentType === 'json') response = await jsonRequest(session, url, method, data, params);
  else if (contentType === 'multipart') response = await multipartRequest(session, url, method, data, params);
  else throw new Error();
  if (response.status === 401) {
    toast.error('승인되지 않은 세션입니다.');
  } else if (response.status === 403) {
    toast.error('세션이 만료되었습니다. 새로고침 해주세요.');
  } else if (response.status === 500) {
    toast.error('서버 오류입니다.');
  } else if (response.status > 404){
    toast.error(`서버와 통신하는 중 ${response.status} 오류가 발생했습니다.`);
  }
  return response;
}
