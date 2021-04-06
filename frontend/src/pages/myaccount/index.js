import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { signIn, signOut, getSession, useSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileBox from '../../components/UserProfileBox'
import withAuth from '../../components/withAuth'



function MyAccount({ data }) {
  const [session, loading] = useSession();
  const [userList, setUserList] = useState('');

  const getUserList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users`, {
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
    <Layout title="내 정보 - Give-U-Con">
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
          {userList && userList.map((item) => (
            <Typography>{item.username}</Typography>
          ))}
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

export default withAuth(MyAccount);
