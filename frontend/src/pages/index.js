import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home/');
  },[])

  return ( null );
}

export default Index;
