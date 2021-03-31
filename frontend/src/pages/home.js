import React from 'react';
import axios from 'axios'
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

Home.getInitialProps = async () => {
  const { data: users } = await axios.get(
    "http://localhost:8000/api/users"
  );
  console.log(data);
  return { users };
};

function Home() {
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
            <Button onClick={() => signIn('kakao')}>Sign in</Button>
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
      </>
    </Container>
  );
}

export default Home;
