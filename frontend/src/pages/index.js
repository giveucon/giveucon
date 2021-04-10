import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import withAuthServerSideProps from './withAuthServerSideProps'
import Layout from '../components/Layout'

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: {},
  }
})

export default function Index({}) {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  },[])
  return null;
}
