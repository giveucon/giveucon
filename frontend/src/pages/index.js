import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import withAuth from '../utils/withAuth'

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home/');
  }, [])

  return null;
}

export default withAuth(Index);
