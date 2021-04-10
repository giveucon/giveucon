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
import InfoIcon from '@material-ui/icons/Info';

import Layout from '../../../components/Layout'
import Section from '../../../components/Section'
import withAuthServerSideProps from '../../withAuthServerSideProps'

const putSelfUser = async (session, selfUser) => {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/" + selfUser.id + "/", {
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

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const prevSelfUser = selfUser
  return {
    props: { prevSelfUser },
  }
})

function Basic({ prevSelfUser }) {
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    id: prevSelfUser.id,
    email: prevSelfUser.email,
    user_name: prevSelfUser.user_name,
    first_name: prevSelfUser.first_name,
    last_name: prevSelfUser.last_name,
    dark_mode: prevSelfUser.dark_mode,
  });
  return (
    <Layout title={"기본 설정 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="기본 설정"
      >
      </Section>
      <Section
        title="기본 정보"
        titlePrefix={<IconButton><InfoIcon /></IconButton>}
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
        <Box paddingY={1}>
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
        <Box paddingY={1}>
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
            label="다크 모드"
            />
          </FormGroup>
        </Box>
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={() => {
              putSelfUser(session, selfUser);
              router.push('/myaccount/settings');
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Basic;
