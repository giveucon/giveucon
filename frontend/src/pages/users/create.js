import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { getSession, useSession } from "next-auth/client";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../../components/Layout'
import Section from '../../components/Section'

function Create(props) {
  const [session, loading] = useSession();
  const [self, setSelf] = useState('');

  const getSelf = async () => {
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
      setSelf(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelf()
  },[])

  return (
    <Layout title="사용자 생성 - Give-U-Con">
      <Section
        backButton
        title="사용자 생성"
      >
      </Section>
      <Section
        title="로그인 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
      {self && self.map((item, key) => (
        <Typography>{item.user_name}</Typography>
      ))}
          
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

export default Create;
