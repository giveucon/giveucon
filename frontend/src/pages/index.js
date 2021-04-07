import { useEffect } from "react";
import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/client";

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    } else {
      router.push('/login')
    }
  });
  return null;
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}
