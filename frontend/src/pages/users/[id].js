import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileSection from '../../components/UserProfileSection';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const userResponse = await getUser(context);
  return {
    props: { selfUser, user: userResponse.data },
  };
})

function Id({ selfUser, user }) {
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
        image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
      >
      </UserProfileSection>
      <Section
        title='소유한 가게'
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
      </Section>
      { selfUser.data.id === user.id && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/myaccount/')}
          >
            내 계정으로 이동
          </Button>
        </Box>
      )}
    </Layout>
  );

}

export default Id;
