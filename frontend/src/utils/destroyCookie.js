import nookies, { destroyCookie as destroyCookieFromNookies } from 'nookies'

export default function destroyCookie(context, name) {
  if (!(typeof window != 'undefined' && window.document)) return nookies.destroy(context, name);
  else return destroyCookieFromNookies(null, name);
}
