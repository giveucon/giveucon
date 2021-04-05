import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../components/Layout'
import Section from '../components/Section'
import withAuth from '../components/withAuth'


function Home() {
  const [session, loading] = useSession();
  const [userList, setUserList] = useState('');

  const  getUserList = async () => { 
    const result = async (session) => await axios.get(
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
    setUserList(result.data)
  }

  useEffect(() => {
    getUserList()
  },[])

  console.log("Hi!!!!!!!!!!!");
  console.log(userList);

  return (
    <Layout title="홈 - Give-U-Con">
      <Section
        backButton
        title="홈"
      >
      </Section>
      <Section
        title="로그인 정보"
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
        </>
      </Section>
    </Layout>
  );
}

export default withAuth(Home);
