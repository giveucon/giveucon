import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { getSession } from "next-auth/client";
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

const getSelfAccount = async (session) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/accounts/self`, {
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

const postSelfUser = async (session, selfUser) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/`, {
        email: selfUser.email,
        user_name: selfUser.user_name,
        first_name: selfUser.first_name,
        last_name: selfUser.last_name,
        dark_mode: selfUser.dark_mode,
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

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfAccountResponse = await getSelfAccount(session)
  return {
    props: { session, selfAccount: selfAccountResponse.data }
  }
}

function Create({ session, selfAccount }) {
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    email: selfAccount.email,
    user_name: selfAccount.username,
    first_name: "",
    last_name: "",
    dark_mode: false,
  });
  const [valueError, setValueError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
  });
  return (
    <Layout title={`사용자 생성 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="사용자 생성"
      >
      </Section>
      <Section
        title="로그인 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name="email"
            value={selfUser.email}
            error={valueError.email}
            fullWidth
            label="이메일"
            onChange={(event) => {
              setSelfUser({ ...selfUser, email: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="user_name"
            value={selfUser.user_name}
            error={valueError.user_name}
            fullWidth
            label="유저네임"
            onChange={(event) => {
              setSelfUser({ ...selfUser, user_name: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="last_name"
            value={selfUser.last_name}
            error={valueError.last_name}
            fullWidth
            label="성"
            onChange={(event) => {
              setSelfUser({ ...selfUser, last_name: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="first_name"
            value={selfUser.first_name}
            error={valueError.first_name}
            fullWidth
            label="이름"
            onChange={(event) => {
              setSelfUser({ ...selfUser, first_name: event.target.value });
            }}
            required
          />
        </Box>
        <Box>
          <FormGroup row>
            <FormControlLabel
            control={
              <Checkbox
                name="dark_mode"
                color="primary"
                checked={selfUser.dark_mode}
                onChange={(event) => {
                  setSelfUser({ ...selfUser, dark_mode: event.target.checked });
                }}
              />
            }
            label="다크 모드"
            />
          </FormGroup>
        </Box>
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await postSelfUser(session, selfUser);
              console.log(response);
              if (response.status === 200) router.push('/myaccount/home');
              else if (response.status === 400) {
                if (response.data.email) setValueError({ ...valueError, email: true });
                else setValueError({ ...valueError, email: false });
                if (response.data.user_name) setValueError({ ...valueError, user_name: true });
                else setValueError({ ...valueError, user_name: false });
                if (response.data.first_name) setValueError({ ...valueError, first_name: true });
                else setValueError({ ...valueError, first_name: false });
                if (response.data.last_name) setValueError({ ...valueError, last_name: true });
                else setValueError({ ...valueError, last_name: false });
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
