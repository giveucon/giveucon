import nookies, { setCookie as setCookieFromNookies } from 'nookies' 

export default function setCookie(context, name, value, params) {
  if (!(typeof window != 'undefined' && window.document)) return nookies.set(context, name, value, params);
  else return setCookieFromNookies(null, name, value, params);
}
