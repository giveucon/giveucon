import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileSection from '../../components/UserProfileSection';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getUser = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/${context.query.id}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const userResponse = await getUser(session, context)
  return {
    props: { session, selfUser, user: userResponse.data },
  }
})

function Id({ session, selfUser, user }) {
  const router = useRouter();
  return (
    <Layout title={`${user.user_name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={user.user_name}
      />
      <UserProfileSection
        name={user.user_name}
        subtitle={user.email}
        image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
      >
      </UserProfileSection>
      <Section
        title="소유한 가게"
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
      </Section>
      { selfUser.id === user.id && (
        <>
          <Box marginY={1}>
            <Button
              color="default"
              fullWidth
              variant="contained"
              onClick={() => router.push('/myaccount')}
            >
              내 계정으로 이동
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default Id;
