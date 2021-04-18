import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import withAuthServerSideProps from './functions/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session },
  };
})

function Index({ session }) {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home/');
    } else {
      router.push('/login/');
    }
  },[])

  return ( null );
}

export default Index;
