import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import withAuthServerSideProps from '../utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  return {
    props: {},
  };
})

function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push('/home/');
  }, [])
  return null;
}

export default Index;
