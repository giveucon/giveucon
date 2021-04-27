import React, { useState } from 'react';
import faker from 'faker';
import { useRouter } from 'next/router'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from '../components/Layout'
import Section from '../components/Section'
import convertJsonToFormData from '../utils/convertJsonToFormData'
import requestToBackend from '../utils/requestToBackend'
import withAuthServerSideProps from '../utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  if (!selfUser.staff) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  return {
    props: { selfUser },
  };
})

function Initialize({ selfUser }) {
  
  const router = useRouter();
  const [initializing, setInitializing] = useState(false);
  const [requestedCount, setRequestedCount] = useState(0);

  const dummyTimeout = 200;
  const allRequestCount = dummyTimeout;

  const postDummyTimeout = async () => {
    await new Promise(r => setTimeout(r, 10));
  };
  
  const postDummyUser = async (user) => {
    return await requestToBackend('api/dummy-users/', 'post', 'json', user, null);
  };
  
  const postDummyStore = async (store) => {
    return await requestToBackend('api/dummy-stores/', 'post', 'multipart', convertJsonToFormData(store), null);
  };

  async function InitializeDatabase() {
    setInitializing(true);
    for (const i of Array(dummyTimeout).keys()) {
      await postDummyTimeout();
      setRequestedCount(prevRequestedCount => prevRequestedCount + 1);
    }
  }

  return (
    <Layout title={`데이터베이스 초기화 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        title='데이터베이스 초기화'
        titlePrefix={<IconButton><WarningIcon /></IconButton>}
      >
        <Box display='flex' justifyContent='center'>
          <Box margin='2rem' position='relative' display='inline-flex'>
            <CircularProgressbar
              value={Math.round(requestedCount / allRequestCount * 100)}
              text={`${Math.round(requestedCount / allRequestCount * 100)}%`}
              styles={buildStyles({
                textColor: '#43a047',
                pathColor: '#43a047',
                pathTransitionDuration: 0
              })}
            />
          </Box>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            disabled={initializing}
            fullWidth
            variant='contained'
            onClick={async () => {
              await InitializeDatabase();
              await new Promise(r => setTimeout(r, 1000));
              router.push('/');
            }}
          >
            데이터베이스 생성
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            disabled={initializing}
            fullWidth
            variant='contained'
            onClick={() => router.back()}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Initialize;
