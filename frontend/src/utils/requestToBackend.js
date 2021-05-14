import axios from 'axios';

import * as constants from '../constants';
import getSession from 'utils/getSession';

const jsonRequest = async (session, url, method, data, params) => {
  return await axios({
    url,
    method,
    data,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      'Authorization': `Bearer ${session.tokens.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params,
  }).then(response => {
    return {
      responseType: constants.RESPONSE_TYPE_OK,
      status: response.status,
      data: response.data
    };
  }).catch(error => {
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
  });
}

const multipartRequest = async (session, url, method, data, params) => {
  return await axios({
    url,
    method,
    data,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      'Authorization': `Bearer ${session.tokens.access_token}`,
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    params,
  }).then(response => {
    return {
      responseType: constants.RESPONSE_TYPE_OK,
      status: response.status,
      data: response.data
    };
  }).catch(error => {
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
    console.error(contentType);
    throw new Error()
  };
  return response;
}
