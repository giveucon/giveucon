import React, { useEffect } from 'react';
import { signIn, getSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Section from '../components/Section'

const useStyles = makeStyles({
  background: {
    height: '100vh',
    backgroundImage: 'url(https://cdn.pixabay.com/photo/2014/07/30/18/26/grocery-store-405522_960_720.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  title: {
    color: 'Black',
  },
  kakaoButton: {
    background: '#ffeb3b',
    color: 'Black',
    '&:hover': {
       background: '#b2a429',
    },
  },
});

function Login({ session }) {
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  },[])

  return (
    <>
      <Head>
        <title>{`로그인 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Box
        className={classes.background}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Box style={{ minHeight: '8rem', minWidth: '16rem' }}>
          <Section
            title='환영합니다!'
          >
            <Box paddingY={5}>
              <Typography align='center' color='textPrimary' variant='h3'>
                giveUcon
              </Typography>
            </Box>
            <Box margin={1}>
              <Button
                className={classes.kakaoButton}
                fullWidth
                variant='contained'
                onClick={() => signIn('kakao')}
              >
                카카오 계정으로 로그인
              </Button>
            </Box>
          </Section>
        </Box>
      </Box>
    </>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

export default Login;
