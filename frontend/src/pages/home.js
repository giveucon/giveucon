import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../components/Layout'
import Section from '../components/Section'
import withAuth from '../components/withAuth'


function Home(props) {
  const [session, loading] = useSession();
  const [userList, setUserList] = useState('');

  const getUserList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/users", {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      setUserList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserList()
  },[])

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
              {userList && userList.map((item, key) => (
                <Typography>{item.user_name}</Typography>
              ))}
              <Button variant="contained" color="primary" onClick={() => signOut()}>Sign out</Button>
            </>
          )}
        </>
      </Section>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

export default Home;
