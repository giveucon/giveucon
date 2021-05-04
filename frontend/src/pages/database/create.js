import React, { useState } from 'react';
import faker from 'faker';
import { useRouter } from 'next/router';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import Layout from 'components/Layout';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import convertImageToFile from 'utils/convertImageToFile';
import convertJsonToFormData from 'utils/convertJsonToFormData';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

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
  const [statePhrase, setStatePhrase] = useState(i18n.t('_waitingUserInput'));
  const [sourcePhrase, setSourcePhrase] = useState(i18n.t(' '));

  const userIdList = [];
  const storeIdList = [];
  const productIdList = [];

  const userNumber = 20;
  const storeNumber = 100;
  const productNumber = 300;
  const allRequestCount = userNumber + storeNumber + productNumber;

  const increaseRequestedCount = () => {
    setRequestedCount(prevRequestedCount => prevRequestedCount + 1);
  }

  const postTimeout = async () => {
    await new Promise(r => setTimeout(r, 10));
  };
  
  const postUser = async (user) => {
    return await requestToBackend(null, 'api/dummy-users/', 'post', 'json', user, null);
  };
  
  const postStore = async (store, imageList) => {
    const processedStore = {
      ...store,
      images: imageList.map(image => image.file),
    }
    return await requestToBackend(null, 'api/dummy-stores/', 'post', 'multipart', convertJsonToFormData(processedStore), null);
  };
  
  const postProduct = async (product, imageList) => {
    const processedProduct = {
      ...product,
      duration: product.duration + ' 00',
      images: imageList.map(image => image.file),
    }
    return await requestToBackend(null, 'api/dummy-products/', 'post', 'multipart', convertJsonToFormData(processedProduct), null);
  };

  const createUser = async () => {
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
    setSourcePhrase(`(${user.user_name})`);
    const userResult = await postUser(user);
    if (userResult.status === 201) {
      userIdList.push(userResult.data.id);
      increaseRequestedCount();
      await postTimeout();
    } else {
      console.log(userResult);
    }
  };

  const createStore = async () => {
    const store = {
      name: faker.company.companyName(),
      description: faker.company.catchPhrase(),
      tags: [],
      user: userIdList[Math.floor(Math.random() * userIdList.length)]
    };
    let imageList = [];
    /*
    for (const i of Array(faker.datatype.number() % 4).keys()) {
      await convertImageToFile(
        faker.image.business(),
        faker.datatype.hexaDecimal(),
        (file) => {imageList.push({file});}
      );
    }
    */
    setSourcePhrase(`(${store.name})`);
    const storeResponse = await postStore(store, imageList);
    if (storeResponse.status === 201) {
      storeIdList.push(storeResponse.data.id);
      increaseRequestedCount();
      await postTimeout();
    } else {
      console.log(storeResponse);
    }
  };

  const createProduct = async () => {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      duration: faker.datatype.number() % 365,
      store: storeIdList[Math.floor(Math.random() * storeIdList.length)]
    };
    let imageList = [];
    setSourcePhrase(`(${product.name})`);
    const productResponse = await postProduct(product, imageList);
    if (productResponse.status === 201) {
      productIdList.push(productResponse.data.id);
      increaseRequestedCount();
      await postTimeout();
    } else {
      console.log(productResponse);
    }
  };

  async function initializeDatabase() {
    setInitializing(true);
    
    /*
    for (const i of Array(userNumber).keys()) {
      const user = await createUser();
      await postTimeout();
      for (const j of Array(storeNumber).keys()) {
        const store = await createStore(user);
        await postTimeout();
        for (const k of Array(productNumber).keys()) {
          await createProduct(store);
          await postTimeout();
        }
      }
    }
    */
    setStatePhrase(`${i18n.t('creating')}: ${i18n.t('account')}`);
    for (const i of Array(userNumber).keys()) {
      await createUser();
    }
    setStatePhrase(`${i18n.t('creating')}: ${i18n.t('store')}`);
    for (const i of Array(storeNumber).keys()) {
      await createStore();
    }
    setStatePhrase(`${i18n.t('creating')}: ${i18n.t('product')}`);
    for (const i of Array(productNumber).keys()) {
      await createProduct();
    }

    setStatePhrase(i18n.t('_databaseSuccessfullyCreated'));
    setSourcePhrase(' ');
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
        <Box margin='1rem'>
          <Box display='flex' justifyContent='center'>
            <Box display='flex' position='relative'>
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
          <Box marginY='1rem'>
            <Typography>{statePhrase}</Typography>
            <Typography>{sourcePhrase}</Typography>
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
              router.push('/home/');
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
