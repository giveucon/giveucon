import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
    '&:hover': {
       background: "#aa2e25",
    },
  },
});

const getStore = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${context.query.id}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

const putStore = async (session, store) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${store.id}`, {
        name: store.name,
        description: store.description,
        user: store.user,
      }, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const prevStore = await getStore(session, context)
  return {
    props: { session, selfUser, prevStore },
  }
})

function Update({ session, selfUser, prevStore }) {
  const router = useRouter();
  const classes = useStyles();
  const [store, setStore] = useState({
    id: prevStore.id,
    name: prevStore.name,
    description: prevStore.description,
    user: prevStore.user,
  });
  return (
    <Layout title={`가게 수정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="가게 수정"
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
              router.push(`/stores/${response.data.id}`);
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
      <Section
        title="위험 구역"
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant="contained"
            onClick={() => router.push({
              pathname: '/stores/delete',
              query: { id: store.id },
            })}
          >
            가게 삭제
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Update;
