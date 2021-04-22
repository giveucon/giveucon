import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';
import useSWR from 'swr';
import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileBox from '../../components/UserProfileBox'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'
import backendFetcher from '../functions/backendFetcher'
import withAuth from '../functions/withAuth'

import refresh from '../session/refresh'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

/*
const selfUserFetcher = async (url, method, contentType, data, params) => {
  const session = await refresh();
  return await axios({
    url,
    data: null,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    params: null,
  }).then(res => res.data);
}
*/

function Index() {
  const {data: selfUser, error: selfUserError} = useSWR(
    [`api/users/self/`, 'get', 'json', null, null],
     (url, method, contentType, data, params) => backendFetcher(url, method, contentType, data, params)
  );
  const router = useRouter();
  const classes = useStyles();

  if (selfUserError) return <div>failed to load</div>
  if (!selfUser) return <div>loading...</div>
  return (
    <Layout title={`내 계정 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='내 계정'
      >
      </Section>
      <Section
        title='내 정보'
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <UserProfileBox
          name={selfUser.data.user_name}
          subtitle={selfUser.data.email}
          image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
        />
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.data.id },
            })}
          >
            내 가게
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/list/',
              query: { user: selfUser.id },
            })}
          >
            내 상품
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupons/list/',
              query: { user: selfUser.id },
            })}
          >
            내 쿠폰
          </Button>
        </Box>
      </Section>
      <Section
        title='관리'
        titlePrefix={<IconButton><SettingsIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/central-notices/`)}
          >
            공지사항
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/myaccount/update/`)}
          >
            설정
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={() => {router.push(`/logout/`)}}
          >
            로그아웃
          </Button>
        </Box>
      </Section>
      <Section
        title='개발자 도구'
        titlePrefix={<IconButton><CodeIcon /></IconButton>}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/initialize/`)}
          >
            데이터베이스 생성
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.push(`/sandbox/components/`)}}
          >
            컴포넌트
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/sandbox/scanner/`)}
          >
            QR코드 스캐너
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {
              toast.success('Hello World');
            }}
          >
            React-Hot-Toast 테스트
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default withAuth(Index);
