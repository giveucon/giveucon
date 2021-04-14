import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const postStore = async (session, store) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/`, {
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
  return {
    props: { session, selfUser },
  }
})

function Create({ session, selfUser }) {
  const router = useRouter();
  const [store, setStore] = useState({
    name: "",
    description: "",
    user: selfUser.id,
  });
  const [storeError, setStoreError] = useState({
    name: false,
    description: false,
  });
  return (
    <Layout title={`가게 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="가게 생성"
      >
        <Box paddingY={1}>
          <TextField
            name="name"
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
            name="description"
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await postStore(session, store);
              if (response.status === 201) {
                router.push(`/stores/${response.id}`);
                toast.success('가게가 생성되었습니다.');
              } 
              else if (response.status === 400) {
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
                toast.error('가게 생성 중 오류가 발생했습니다.');
              }
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
