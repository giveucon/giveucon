import React from "react";
import axios from 'axios'
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import Styled from 'styled-components'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileBox from '../../components/UserProfileBox'
import UserProfileSection from '../../components/UserProfileSection'


const fetchData = async (session) => await axios.get(
  `http://localhost:8000/api/users`, {
    headers: {
      'Authorization': "Bearer " + session?.accessToken,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  })
  .then(res => ({
    error: false,
    data: res.data,
  }))
  .catch((error) => ({
    error: true,
    data: ["failed", "failed"],
  }),
);

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const data = await fetchData(session);

  return {
    props: data,
  };
}

function MyAccount({ data }) {
  const [session, loading] = useSession();
  console.log(data);
  return (
    <Layout>
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
          name="Username"
          subtitle="Subtitle"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
        />
        <>
          {
            loading && <h2>Loading...</h2>
          }

          {!loading && !session && (
            <>
              <Typography>{!session && "User is not logged in"}</Typography>
              <Button variant="contained" color="primary" onClick={() => signIn('kakao')}>Sign in</Button>
              <Button variant="contained" color="primary" onClick={() => signIn('kakao_reauthenticate')}>Sign in (Reauth)</Button>
            </>
          )}
          {!loading && session && (
            <>
              <Typography>Signed in as {session.user.email}</Typography>
              {
                session.accessToken && (
                  <Typography>User has access token {session.accessToken}</Typography>
                )
              }
              {
                session.refreshToken && (
                  <Typography>User has refresh token {session.refreshToken}</Typography>
                )
              }
              <Button variant="contained" color="primary" onClick={() => signOut()}>Sign out</Button>
            </>
          )}
          {data.map((item) => (
            <Typography>{item.username}</Typography>
          ))}
        </>
      </Section>
    </Layout>
  );
}

export default MyAccount;
