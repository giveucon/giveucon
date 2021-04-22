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
import withAuth from '../../utils/withAuth'

function Id({ selfUserResponse }) {

  const router = useRouter();
  const [userResponse, setUserResponse] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const userResponse = await requestToBackend(`api/users/${router.query.id}/`, 'get', 'json', null, null);;
      setUserResponse(userResponse);
    }
    fetch();
  }, []);
  if (!userResponse) return <div>loading...</div>

  return (
    <Layout title={`${userResponse.data.user_name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={userResponse.data.user_name}
      />
      <UserProfileSection
        name={userResponse.data.user_name}
        subtitle={userResponse.data.email}
        image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
      >
      </UserProfileSection>
      <Section
        title='소유한 가게'
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
      </Section>
      { selfUserResponse.data.id === userResponse.data.id && (
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

export default withAuth(Id);
