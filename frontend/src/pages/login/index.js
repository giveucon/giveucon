import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import getCookies from 'utils/getCookies';
import withoutAuthServerSideProps from 'utils/withoutAuthServerSideProps'

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

export const getServerSideProps = withoutAuthServerSideProps(async (context, lng, lngDict) => {
  const cookies = getCookies(context)
  if (cookies.giveucon_session) {
    return {
      redirect: { permanent: false, destination: '/home/', }
    }
  }
  return {
    props: { lng, lngDict }
  };
})

function Index( lng, lngDict ) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>{`${i18n.t('login')} - ${i18n.t('_appName')}`}</title>
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
            title={i18n.t('_welcome')}
          >
            <Box marginY={5}>
              <Typography align='center' color='textPrimary' variant='h3'>
              {i18n.t('_appName')}
              </Typography>
            </Box>
            <Box marginY={1}>
              <Button
                className={classes.kakaoButton}
                fullWidth
                variant='contained'
                onClick={() => router.push('/oauth/kakao/login/')}
              >
                {i18n.t('loginAsKakaoAccount')}
              </Button>
            </Box>
          </Section>
        </Box>
      </Box>
    </>
  );
}

export default Index;
