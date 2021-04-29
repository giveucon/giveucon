import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'

export default function Logout({ setDarkMode }) {
  const router = useRouter();
  setDarkMode('auto');
  useEffect(() => {
    destroyCookie(null, 'giveucon', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    router.push('/');
  });
  return null;
}
