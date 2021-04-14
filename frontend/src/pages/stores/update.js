import React, { useState } from 'react';
import toast from 'react-hot-toast';
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
    return { status: error.response.status, data: error.response.data }
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
    return { status: error.response.status, data: error.response.data }
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
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
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
            error={storeError.name}
            fullWidth
            label="가게 이름"
            onChange={(event) => {
              setStore(prevStore => ({ ...prevStore, name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="email"
            value={store.description}
            error={storeError.description}
            fullWidth
            label="가게 설명"
            multiline
            onChange={(event) => {
              setStore(prevStore => ({ ...store, description: event.target.value }));
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
              if (response.status === 200) {
                router.push(`/stores/${response.data.id}`);
                toast.success('가게가 업데이트 되었습니다.');
              } else if (response.status === 400) {
                if (response.data.name) {
                  setStoreError(prevStoreError => ({...prevStoreError, name: true}));
                } else {
                  setStoreError(prevStoreError => ({...prevStoreError, name: false}));
                }
                if (response.data.description) {
                  setStoreError(prevStoreError => ({...prevStoreError, description: true}));
                } else {
                  setStoreError(prevStoreError => ({...prevStoreError, description: false}));
                }
                toast.error('입력란을 확인하세요.');
              } else {
                toast.error('가게 업데이트 중 오류가 발생했습니다.');
              }
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
