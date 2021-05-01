import React, { useState } from 'react';
import faker from 'faker';
import { useRouter } from 'next/router'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  if (!selfUser.staff){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { selfUser },
  };
})

function create({ selfUser }) {
  
  const i18n = useI18n();
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
    <Layout
      locale={selfUser.locale}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('createDatabase')} - ${i18n.t('_appName')}`}
    >
      <Section
        title={i18n.t('createDatabase')}
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
            {i18n.t('createDatabase')}
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
            {i18n.t('goBack')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default create;
