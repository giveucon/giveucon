import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

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

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { selfUser },
  }
})

function Create({ selfUser }) {
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
