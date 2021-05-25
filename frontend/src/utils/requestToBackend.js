import axios from 'axios';

import getSession from 'utils/getSession';
import * as constants from '../constants';

const jsonRequest = async (session, url, method, data, params) => await axios({
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
}).then(response => ({
    responseType: constants.RESPONSE_TYPE_OK,
    status: response.status,
    data: response.data
  })).catch(error => {
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

})

const multipartRequest = async (session, url, method, data, params) => await axios({
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
}).then(response => ({
    responseType: constants.RESPONSE_TYPE_OK,
    status: response.status,
    data: response.data
  })).catch(error => {
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

})

export default async function requestToBackend(context, url, method, contentType, data=null, params=null, defaultOrigin=true) {

  const session = await getSession(context);
  if (!session) throw new Error();

  let processedUrl = url;
  if (!defaultOrigin) processedUrl = new URL(url).pathname;

  let response = null;
  if (contentType === 'json') response = await jsonRequest(session, processedUrl, method, data, params);
  else if (contentType === 'multipart') response = await multipartRequest(session, processedUrl, method, data, params);
  else {
    throw new Error()
  };
  return response;
}
