import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'

export default function Logout({ setDarkMode }) {
  const router = useRouter();
  setDarkMode('auto');
  useEffect(() => {
    destroyCookie(null, 'giveucon_session', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    destroyCookie(null, 'giveucon_settings', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    router.push('/');
  });
  return null;
}
