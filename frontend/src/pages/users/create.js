import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client';
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
import requestToBackend from '../requestToBackend'

const getSelfAccount = async (session, context) => {
  return await requestToBackend(session, 'api/accounts/self/', 'get', 'json');
};

const postSelfUser = async (session, selfUser) => {
  const data = {
    email: selfUser.email,
    user_name: selfUser.user_name,
    first_name: selfUser.first_name,
    last_name: selfUser.last_name,
    dark_mode: selfUser.dark_mode,
  };
  return await requestToBackend(session, 'api/users/', 'post', 'json', data, null);
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const selfAccountResponse = await getSelfAccount(session);
  return {
    props: { session, selfAccount: selfAccountResponse.data }
  };
}

function Create({ session, selfAccount }) {
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    email: selfAccount.email,
    user_name: selfAccount.username,
    first_name: null,
    last_name: null,
    dark_mode: false,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
  });
  return (
    <Layout title={`사용자 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='사용자 생성'
      >
      </Section>
      <Section
        title='로그인 정보'
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='email'
            value={selfUser.email}
            error={selfUserError.email}
            fullWidth
            label='이메일'
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, email: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='user_name'
            value={selfUser.user_name}
            error={selfUserError.user_name}
            fullWidth
            label='유저네임'
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, user_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='last_name'
            value={selfUser.last_name}
            error={selfUserError.last_name}
            fullWidth
            label='성'
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, last_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='first_name'
            value={selfUser.first_name}
            error={selfUserError.first_name}
            fullWidth
            label='이름'
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, first_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box>
          <FormGroup row>
            <FormControlLabel
            control={
              <Checkbox
                name='dark_mode'
                color='primary'
                checked={selfUser.dark_mode}
                onChange={(event) => {
                  setSelfUser(prevSelfUser => ({ ...prevSelfUser, dark_mode: event.target.checked }));
                }}
              />
            }
            label='다크 모드'
            />
          </FormGroup>
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postSelfUser(session, selfUser);
            if (response.status === 201) {
              router.push(`/myaccounts/home/`);
              toast.success('계정이 생성되었습니다.');
            }
            else if (response.status === 400) {
              if (response.data.email) {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, email: true}));
              } else {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, email: false}));
              }
              if (response.data.user_name) {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, user_name: true}));
              } else {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, user_name: false}));
              }
              if (response.data.first_name) {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, first_name: true}));
              } else {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, first_name: false}));
              }
              if (response.data.last_name) {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, last_name: true}));
              } else {
                setSelfUserError(prevSelfUserError => ({...prevSelfUserError, last_name: false}));
              }
              toast.error('입력란을 확인하세요.');
            }
          }}
        >
          제출
        </Button>
      </Box>
    </Layout>
  );
}

export default Create;
