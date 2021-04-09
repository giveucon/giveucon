import React, { useState } from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../../components/Layout'
import Section from '../../components/Section'

const getSelfUser = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/self", {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const postStore = async (session, selfUser, store) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/", {
        name: store.name,
        description: store.description,
        owner: selfUser.id,
      }, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfUser = await getSelfUser(session)
  return {
    props: { session, selfUser }
  }
}

function Create({ session, selfUser }) {
  const router = useRouter();
  const [store, setStore] = useState({
    name: "",
    description: "",
  });
  return (
    <Layout title={"가게 생성 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="가게 생성"
      >
        <Box paddingY={1}>
          <TextField
            name="username"
            value={store.name}
            fullWidth
            label="가게 이름"
            onChange={(event) => {
              setStore({ ...store, name: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="email"
            value={store.description}
            fullWidth
            label="가게 설명"
            multiline
            onChange={(event) => {
              setStore({ ...store, description: event.target.value });
            }}
            required
          />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await postStore(session, selfUser, store);
              router.push(`/stores/${response.id}`);
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Create;
