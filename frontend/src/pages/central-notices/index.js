import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: {}
  }
})

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/central-notices/list/');
  }, [])

  return null;
}

export default Index;
