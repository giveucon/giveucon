import React from 'react';
import axios from 'axios';
import { signIn, signOut, getSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../components/Layout'
import Section from '../components/Section'
import withAuth from '../components/withAuth'

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

function Home({session}) {

  return (
    <Layout title={"홈 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="홈"
      >
      </Section>
      <Section
        title="로그인 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
      <Typography>Signed in as {session.user.email}</Typography>
      </Section>
    </Layout>
  );
}

export default withAuth(Home);
