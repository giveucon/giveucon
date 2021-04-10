import React from 'react';
import axios from 'axios'
import { signIn, signOut, getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileBox from '../../components/UserProfileBox'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
  },
});

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { selfUser },
  }
})

function Home({ selfUser }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={"내 정보 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="내 계정"
      >
      </Section>
      <Section
        title="내 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <UserProfileBox
          name={selfUser.user_name}
          subtitle={selfUser.email}
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
        />
        <Box marginY={1}>
          <Button
            color="default"
            fullWidth
            variant="contained"
            onClick={() => router.push(`/myaccount/stores`)}
          >
            내 가게
          </Button>
        </Box>
      </Section>
      <Section
        title="설정"
        titlePrefix={<IconButton><SettingsIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color="default"
            fullWidth
            variant="contained"
            onClick={() => router.push(`/myaccount/settings`)}
          >
            설정
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant="contained"
            onClick={() => {
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/" })
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Home;
