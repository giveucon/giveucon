import React from 'react';
import { signIn, signOut, useSession } from "next-auth/client";
import Styled from 'styled-components'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const Title = Styled.h1`
  color: green;
  font-size: 50px;
`

function Test() {
  const [session, loading] = useSession();
  return (
    <Container maxWidth="sm">
      <>
        {
          loading && <h2>Loading...</h2>
        }

        {!loading && !session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
            <pre>{!session && "User is not logged in"}</pre>
          </>
        )}
        {!loading && session && (
          <>
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
            {
              session.accessToken && (
                <pre>User has access token</pre>
              )
            }
          </>
        )}
      </>
    </Container>
  );
}

export default Test;
