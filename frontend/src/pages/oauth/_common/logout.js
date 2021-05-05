import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'

export async function getServerSideProps(context) {

  destroyCookie(context, 'giveucon_session', {
    maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
    path: process.env.NEXT_PUBLIC_COOKIE_PATH,
  });
  destroyCookie(context, 'giveucon_settings', {
    maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
    path: process.env.NEXT_PUBLIC_COOKIE_PATH,
  });

  return {
    redirect: {
      destination: process.env.NEXT_PUBLIC_BASE_URL,
      permanent: false
    }
  }
}

export default function Logout() {

}
