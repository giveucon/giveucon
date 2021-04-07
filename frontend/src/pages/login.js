import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { signIn, getSession, useSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../components/Layout'
import Section from '../components/Section'
import withAuth from '../components/withAuth'

function Login({ data }) {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  },[])

  return (
    <Layout title="로그인 - Give-U-Con">
      <Section
        backButton
        title="로그인"
      >
      </Section>
      <Section
        title="로그인 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <>
          {!loading && !session && (
            <>
              <Typography>{!session && "로그인되어 있지 않습니다"}</Typography>
              <Button
                color="primary"
                fullWidth
                variant="contained"
                onClick={() => signIn()}>
                  로그인
                </Button>
            </>
          )}
        </>
      </Section>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

export default Login;
