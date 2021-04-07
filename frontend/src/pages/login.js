import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { signIn, getSession, useSession } from "next-auth/client";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../components/Layout'
import Section from '../components/Section'

const useStyles = makeStyles({
  kakaoButton: {
    background: 'yellow',
    color: 'black',
  },
});

function Login() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  },[])

  return (
    <Layout bottomNav={false} title="로그인 - Give-U-Con">
      <Box
        bgcolor="error.main"
        paddingX={2}
        style={{ height: '100vh' }}
      >
        <Box
          alignItems="center"
          bgcolor="primary.main"
          display="flex"
          justifyContent="center"
          style={{ height: '50vh' }}
        >
          <Typography variant="h3">GIVE-U-CON</Typography>
        </Box>
        <Box
          alignItems="center"
          bgcolor="secondary.main"
          display="flex"
          justifyContent="center"
          style={{ height: '50vh' }}
        >
          <Button
            className={classes.kakaoButton}
            fullWidth
            variant="contained"
            onClick={() => signIn("kakao")}
          >
            카카오 계정으로 로그인
          </Button>
        </Box>
      </Box>
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
