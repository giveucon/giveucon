import axios from 'axios';

export default async function request({url, method, data=null, params=null}) {
  return await axios({
    url,
    method,
    data,
    params
  });
}
