import React from "react";
import { useEffect, useState } from 'react';
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import Styled from 'styled-components'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import axios from 'axios'


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
    <Container maxWidth="sm">
      <>
        {
          loading && <h2>Loading...</h2>
        }

        {!loading && !session && (
          <>
            Not signed in <br />
            <Button onClick={() => signIn()}>Sign in</Button>
            <pre>{!session && "User is not logged in"}</pre>
          </>
        )}
        {!loading && session && (
          <>
            Signed in as {session.user.email} <br />
            <Button onClick={() => signOut()}>Sign out</Button>
            {
              session.accessToken && (
                <pre>User has access token {session.accessToken}</pre>
              )
            }
          </>
        )}
        {data.map((item) => (
            <Typography>{item.username}</Typography>
        ))}
      </>
    </Container>
  );
}

export default Home;
