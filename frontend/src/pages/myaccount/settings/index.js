import React from 'react';
import axios from 'axios'
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from '../../../components/Layout'
import Section from '../../../components/Section'
import UserProfileBox from '../../../components/UserProfileBox'
import withAuth from '../../../components/withAuth'

const getSelfUser = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/self", {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfUser = await getSelfUser(session)
  return {
    props: { session, selfUser }
  }
}

function Index({ session, selfUser }) {
  const router = useRouter();
  return (
    <Layout title={"설정 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="설정"
      >
      </Section>
      <Section
        title="설정"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color="default"
            fullWidth
            variant="contained"
            onClick={() => router.push(`/myaccount/settings/basic`)}
          >
            기본 설정
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default withAuth(Index);
