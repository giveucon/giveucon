import React from 'react';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../components/AlertBox'
import Layout from '../components/Layout'
import Section from '../components/Section'
import withAuthServerSideProps from './functions/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session, selfUser },
  };
})

function Logout({ session, selfUser }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`로그아웃 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='로그아웃'
      >
        <AlertBox content='로그아웃 하시겠습니까?' variant='question' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={() => {
              signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/` })
              router.push(`/login/`)
            }}
          >
            로그아웃
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Logout;
