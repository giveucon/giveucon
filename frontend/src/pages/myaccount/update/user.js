import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../../../components/Layout'
import Section from '../../../components/Section'
import withAuthServerSideProps from '../../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
    '&:hover': {
       background: '#aa2e25',
    },
  },
});

const putSelfUser = async (session, selfUser) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/${selfuser.id}/`, {
        email: selfUser.email,
        user_name: selfUser.user_name,
        first_name: selfUser.first_name,
        last_name: selfUser.last_name,
        dark_mode: selfUser.dark_mode,
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
  const prevSelfUserResponse = selfUser
  return {
    props: { session, prevSelfUser: prevSelfUserResponse.data },
  }
})

function User({ session, prevSelfUser }) {
  const router = useRouter();
  const classes = useStyles();
  const [selfUser, setSelfUser] = useState({
    id: prevSelfUser.id,
    email: prevSelfUser.email,
    user_name: prevSelfUser.user_name,
    first_name: prevSelfUser.first_name,
    last_name: prevSelfUser.last_name,
    dark_mode: prevSelfUser.dark_mode,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
  });
  return (
    <Layout title={`사용자 설정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='사용자 설정'
      >
      </Section>
      <Section
        title='사용자 정보'
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
            name='username'
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
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await putSelfUser(session, selfUser);
              if (response.status === 200) {
                router.push('/myaccount/update');
                toast.success('계정이 업데이트 되었습니다.');
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
              } else {
                toast.error('계정 업데이트 중 오류가 발생했습니다.');
              }
            }}
          >
            제출
          </Button>
        </Box>
      </Section>
      <Section
        title='위험 구역'
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={() => router.push('/myaccount/delete')}
          >
            계정 탈퇴
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default User;
