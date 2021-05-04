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
import convertImageToFile from 'utils/convertImageToFile'
import convertJsonToFormData from 'utils/convertJsonToFormData'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  if (!selfUser.staff){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Create({ lng, lngDict, selfUser }) {
  
  const i18n = useI18n();
  const router = useRouter();
  const [initializing, setInitializing] = useState(false);
  const [requestedCount, setRequestedCount] = useState(0);

  const dummyTimeoutNumber = 200;
  const dummyUserNumber = 4;
  const dummyStoreNumber = 2;
  const allRequestCount = dummyUserNumber + (dummyUserNumber * dummyStoreNumber);

  const increaseRequestedCount = () => {
    setRequestedCount(prevRequestedCount => prevRequestedCount + 1);
  }

  const postDummyTimeout = async () => {
    await new Promise(r => setTimeout(r, 100));
  };
  
  const postDummyUser = async (user) => {
    return await requestToBackend(null, 'api/dummy-users/', 'post', 'json', user, null);
  };
  
  const postDummyStore = async (store, imageList) => {
    const processedStore = {
      ...store,
      images: imageList.map(image => image.file),
    }
    return await requestToBackend(null, 'api/dummy-stores/', 'post', 'multipart', convertJsonToFormData(processedStore), null);
  };

  const createDummyUser = async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const user = {
      email: `${firstName}.${lastName}@giveucon.com`,
      user_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      locale: 'ko',
      dark_mode: false,
    };
    const userResult = await postDummyUser(user);
    if (userResult.status === 201) {
      increaseRequestedCount();
      return userResult.data;
    } else {
      console.log(userResult);
      throw new Error();
    }
  };

  const createDummyStore = async (user) => {
    const store = {
      name: faker.company.companyName(),
      description: faker.company.catchPhrase(),
      tags: [],
      user: user.id,
    };
    let imageList = [];
    /*
    for (const i of Array(faker.datatype.number() % 4).keys()) {
      await convertImageToFile(faker.image.business(), faker.datatype.hexaDecimal(), (file) => {
        imageList.push({file});
      });
    }
    */
    const storeResult = await postDummyStore(store, imageList);
    if (storeResult.status === 201) {
      increaseRequestedCount();
    } else {
      console.log(storeResult);
      throw new Error();
    }
  };

  async function initializeDatabase() {
    setInitializing(true);
    for (const i of Array(dummyUserNumber).keys()) {
      const user = await createDummyUser();
      await postDummyTimeout();
      for (const i of Array(dummyStoreNumber).keys()) {
        await createDummyStore(user);
        await postDummyTimeout();
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    router.push('/home/');
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
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
              await initializeDatabase();
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

export default Create;
