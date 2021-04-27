import nookies, { parseCookies as parseCookiesFromNookies } from 'nookies'

export default function getCookies(context) {
  if (!(typeof window != 'undefined' && window.document)) return nookies.get(context);
  else return parseCookiesFromNookies();
}
