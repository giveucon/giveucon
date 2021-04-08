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

const getSelfAccount = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/accounts/self", {
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

const postSelfUser = async (session, selfUser) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/", {
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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfAccount = await getSelfAccount(session)
  return {
    props: { session, selfAccount }
  }
}

function Create({ session, selfAccount }) {
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    email: selfAccount.email,
    user_name: selfAccount.username,
    first_name: "",
    last_name: "",
    dark_mode: false
  });
  return (
    <Layout title={"사용자 생성 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
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
            name="username"
            value={selfUser.user_name}
            fullWidth
            label="사용자 이름"
            onChange={(event) => {
              setSelfUser({ ...selfUser, user_name: event.target.value });
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name="email"
            value={selfUser.email}
            fullWidth
            label="이메일"
            onChange={(event) => {
              setSelfUser({ ...selfUser, email: event.target.value });
            }}
            required
          />
        </Box>
        <Box>
          <TextField
            name="last_name"
            value={selfUser.last_name}
            fullWidth
            label="성"
            onChange={(event) => {
              setSelfUser({ ...selfUser, last_name: event.target.value });
            }}
            required
          />
        </Box>
        <Box>
          <TextField
            name="first_name"
            value={selfUser.first_name}
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
            label="Dark Mode"
            />
          </FormGroup>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            onClick={ () => {
                postSelfUser(session, selfUser);
                router.push('/myaccount');
              }
            }
          >
            제출
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Create;
