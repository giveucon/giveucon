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
  const [selfUser, setSelfUser] = useState('');

  const getSelfUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/self`, {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      setSelfUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelfUser()
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
      {selfUser && (
        <UserProfileBox
          name={selfUser.user_name}
          subtitle={selfUser.email}
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
        />
      )}
        <>
          {!loading && !session && (
            <Typography>{!session && "User is not logged in"}</Typography>
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

export default withAuth(MyAccount);
