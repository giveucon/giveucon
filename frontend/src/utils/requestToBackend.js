import axios from 'axios';
import toast from 'react-hot-toast';

import getSession from 'utils/getSession';

const jsonRequest = async (session, url, method, data, params) => {
  return await axios({
    url,
    method,
    data,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params,
  }).then(res => {
    return {status: res.status, data: res.data}
  }).catch(error => {
    return {status: error.response.status, data: error.response.data}
  });
}

const multipartRequest = async (session, url, method, data, params) => {
  return await axios({
    url,
    method,
    data,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    params,
  }).then(res => {
    return {status: res.status, data: res.data}
  }).catch(error => {
    return {status: error.response.status, data: error.response.data}
  });
}

export default async function requestToBackend(context, url, method, contentType, data=null, params=null, defaultOrigin=true) {

  const session = await getSession(context);
  if (!session) throw new Error();

  if (!defaultOrigin) url = new URL(url).pathname;
  
  let response = null;
  if (contentType === 'json') response = await jsonRequest(session, url, method, data, params);
  else if (contentType === 'multipart') response = await multipartRequest(session, url, method, data, params);
  else {
    console.log(contentType);
    throw new Error()
  };
  return response;
}
