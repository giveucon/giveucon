import React, { useEffect } from 'react';
import { signIn, getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../components/Layout'

const useStyles = makeStyles({
  background: {
    backgroundImage: "url(https://cdn.pixabay.com/photo/2014/07/30/18/26/grocery-store-405522_960_720.jpg)"
  },
  title: {
    color: "white"
  },
  kakaoButton: {
    background: 'yellow',
    color: 'black',
  },
});

function Login({session}) {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  },[])

  return (
    <Layout bottomNav={false} title={"로그인 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Box
        className={classes.background}
        paddingX={5}
        style={{ height: '100vh' }}
      >
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          style={{ height: '50vh' }}
        >
          <Typography
            className={classes.title}
            variant="h3"
          >
            giveUcon
          </Typography>
        </Box>
        <Box
          alignItems="center"
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
