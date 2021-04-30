import React from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import UserProfileBox from '../../components/UserProfileBox'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  return {
    props: { selfUser },
  };
})

function Index({ selfUser }) {

  const router = useRouter();
  const classes = useStyles();
  
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
          name={selfUser.user_name}
          subtitle={selfUser.email}
          image={gravatar.url(selfUser.email, {default: 'identicon'})}
        />
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.id },
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
            onClick={() => router.push(`/central-notices/list/`)}
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

export default Index;
