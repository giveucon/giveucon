import React, { useState } from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';

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

const getStore = async (session, id) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/" + id, {
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

const putStore = async (session, store) => {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/" + store.id + "/", {
        name: store.name,
        description: store.description,
        owner: store.owner,
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
  const prevStore = await getStore(session, context.query.id)
  return {
    props: { session, selfUser, prevStore }
  }
}

function Update({ session, selfUser, prevStore }) {
  const router = useRouter();
  const [store, setStore] = useState({
    id: prevStore.id,
    name: prevStore.name,
    description: prevStore.name,
    owner: prevStore.owner,
  });
  return (
    <Layout title={"가게 정보 수정 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="가게"
      >
      </Section>
      <Section
        title="기본 정보"
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
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
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await putStore(session, store);
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

export default Update;
