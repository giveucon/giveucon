import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios'
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import Styled from 'styled-components'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../components/Layout'
import Section from '../components/Section'


const Title = Styled.h1`
  color: green;
  font-size: 50px;
`

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
  console.log("home.js : session");
  console.log(session);
  const data = await fetchData(session);

  return {
    props: data,
  };
}

function Home({ data }) {
  const [session, loading] = useSession();
  console.log(data);
  return (
    <Layout>
      <Section
        backButton
        title="홈"
      >
      </Section>
      <Section
        title="테스트하는 중..."
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <>
          {
            loading && <h2>Loading...</h2>
          }

          {!loading && !session && (
            <>
              <Typography>{!session && "User is not logged in"}</Typography>
              <Button variant="contained" color="primary" onClick={() => signIn()}>Sign in</Button>
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
                  <Typography >User has refresh token {session.refreshToken}</Typography>
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

export default Home;
