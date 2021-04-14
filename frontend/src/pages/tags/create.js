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

const postTag = async (session, tag) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/tags/`, {
        name: tag.name,
      }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
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
  const [tag, setTag] = useState({
    name: '',
  });
  const [tagError, setTagError] = useState({
    name: false,
  });
  return (
    <Layout title={`태그 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='태그 생성'
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={tag.name}
            error={tagError.name}
            fullWidth
            label='태그 이름'
            onChange={(event) => {
              setTag(prevTag => ({ ...prevTag, name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box display='flex' justifyContent='flex-end'>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await postTag(session, tag);
              if (response.status === 201) {
                // router.push(`/stores/${response.id}`);
                toast.success('태그가 생성되었습니다.');
              } 
              else if (response.status === 400) {
                if (response.data.name) {
                  setTagError(prevTagError => ({...prevTagError, name: true}));
                } else {
                  setTagError(prevTagError => ({...prevTagError, name: false}));
                }
                toast.error('입력란을 확인하세요.');
              } else {
                toast.error('태그 생성 중 오류가 발생했습니다.');
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
