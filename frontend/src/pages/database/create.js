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
import usersJson from '../../../public/jsons/init/users';
import storesJson from '../../../public/jsons/init/stores';
import centralNoticesJson from '../../../public/jsons/init/central_notices';

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) =>
/*
  if (!selfUser.staff){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
*/
   ({
    props: { lng, lngDict, selfUser }
  })
)

function Create({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [initializing, setInitializing] = useState(false);
  const [requestedCount, setRequestedCount] = useState(0);
  const [statePhrase, setStatePhrase] = useState(i18n.t('_waitingUserInput'));
  const [sourcePhrase, setSourcePhrase] = useState(i18n.t(''));

  const userIdList = [];
  const storeIdList = [];
  const productIdList = [];
  const centralNoticeIdList = [];
  const storeNoticeIdList = [];

  const imageMaxAmount = 3;
  
  let allRequestCount = 0;

  allRequestCount = allRequestCount + usersJson.length;
  allRequestCount = allRequestCount + storesJson.length;
  storesJson.map((item) => {
    allRequestCount = allRequestCount + item.products.length;
    allRequestCount = allRequestCount + item.notices.length;
  })
  allRequestCount = allRequestCount + centralNoticesJson.length;

  const increaseRequestedCount = () => {
    setRequestedCount(prevRequestedCount => prevRequestedCount + 1);
  }

  const getImageListFromUnsplash = async (keyword) => {
    const imageList = [];
    for (let i = 0; i < faker.datatype.number() % imageMaxAmount; i++) {
      await convertImageToFile(
        `/unsplash/1600x900/?${keyword}`,
        faker.datatype.uuid(),
        (file) => {
          const image = {file};
          imageList.push(image);
        }
      );
    }
    return imageList;
  };

  const postUser = async (user) => await requestToBackend(null, 'api/dummy-users/', 'post', 'json', user, null);

  const postStore = async (store, imageList) => {
    const processedStore = {
      ...store,
      images: imageList.map(image => image.file),
    }
    return await requestToBackend(null, 'api/dummy-stores/', 'post', 'multipart', convertJsonToFormData(processedStore), null);
  };

  const postStoreLocation = async (store, location) => {
    const data = {
      store: store.id,
      location
    };
    return await requestToBackend(null, '/api/store-locations/', 'post', 'json', data, null);
  };

  const postProduct = async (product, imageList) => {
    const processedProduct = {
      ...product,
      duration: `${product.duration  } 00`,
      images: imageList.map(image => image.file),
    }
    return await requestToBackend(null, 'api/dummy-products/', 'post', 'multipart', convertJsonToFormData(processedProduct), null);
  };

  const postCentralNotice = async (centralNotice, imageList) => {
    const processedCentralNotice = {
      article: {
        ...centralNotice.article,
        images: imageList.map(image => image.file),
      }
    }
    return await requestToBackend(null, 'api/central-notices/', 'post', 'multipart', convertJsonToFormData(processedCentralNotice), null);
    // return await requestToBackend(null, 'api/dummy-central-notices/', 'post', 'multipart', convertJsonToFormData(processedCentralNotice), null);
  };

  const postStoreNotice = async (storeNotice, imageList) => {
    const processedStoreNotice = {
      article: {
        ...storeNotice.article,
        images: imageList.map(image => image.file),
      },
      store: storeNotice.store
    }
    return await requestToBackend(null, 'api/dummy-store-notices/', 'post', 'multipart', convertJsonToFormData(processedStoreNotice), null);
  };

  const createUser = async (user) => {
    const postUserResponse = await postUser(user);
    if (postUserResponse.status === 201) {
      userIdList.push(postUserResponse.data.id);
      increaseRequestedCount();
      return postUserResponse.data;
    }
    console.error(postUserResponse);
    return null;
  };

  const createStore = async (store, imageList) => {
    const postStoreResponse = await postStore(store, imageList);
    if (postStoreResponse.status === 201) {
      const postStoreLocationResponse = await postStoreLocation(postStoreResponse.data, store.location);
      if (postStoreLocationResponse.status === 201) {
      storeIdList.push(postStoreResponse.data.id);
      increaseRequestedCount();
      return postStoreResponse.data;
      }
      console.error(postStoreLocationResponse);
      return null;
    }
    console.error(postStoreResponse);
    return null;
  };

  const createProduct = async (product, imageList) => {
    const postProductResponse = await postProduct(product, imageList);
    if (postProductResponse.status === 201) {
      productIdList.push(postProductResponse.data.id);
      increaseRequestedCount();
      return postProductResponse.data;
    }
    console.error(postProductResponse);
    return null;
  };

  const createCentralNotice = async (centralNotice, imageList) => {
    const postCentralNoticeResponse = await postCentralNotice(centralNotice, imageList);
    if (postCentralNoticeResponse.status === 201) {
      centralNoticeIdList.push(postCentralNoticeResponse.data.id);
      increaseRequestedCount();
      return postCentralNoticeResponse.data;
    }
    console.error(postCentralNoticeResponse);
    return null;
  };

  const createStoreNotice = async (storeNotice, imageList) => {
    const postStoreNoticeResponse = await postStoreNotice(storeNotice, imageList);
    if (postStoreNoticeResponse.status === 201) {
      storeNoticeIdList.push(postStoreNoticeResponse.data.id);
      increaseRequestedCount();
      return postStoreNoticeResponse.data;
    }
    console.error(postStoreNoticeResponse);
    return null;
  };

  async function initializeDatabase() {
    setInitializing(true);

    for (let i = 0; i < usersJson.length; i++) {
      const user = { ...usersJson[i] };
      setStatePhrase(`${i18n.t('creating')}: ${i18n.t('account')}`);
      setSourcePhrase(`(${user.user_name})`);
      await createUser(user);
    }

    for (let i = 0; i < storesJson.length; i++) {
      const store = {
        ...storesJson[i],
        user: userIdList[Math.floor(Math.random() * userIdList.length)],
        tags: [],
        image_keywords: null,
        products: null,
        notices: null
      };
      setStatePhrase(`${i18n.t('creating')}: ${i18n.t('store')}`);
      setSourcePhrase(`(${store.name})`);
      const imageList = await getImageListFromUnsplash(storesJson[i].image_keywords[0]);
      const newStore = await createStore(store, imageList);

      for (let j = 0; j < storesJson[i].products.length; j++) {
        const product = {
          ...storesJson[i].products[j],
          store: newStore.id,
          image_keywords: null
        };
        setStatePhrase(`${i18n.t('creating')}: ${i18n.t('product')}`);
        setSourcePhrase(`(${product.name})`);
        const imageList = await getImageListFromUnsplash(storesJson[i].products[j].image_keywords[0]);
        await createProduct(product, imageList);
      };

      for (let j = 0; j < storesJson[i].notices.length; j++) {
        const storeNotice = {
          article: {
            ...storesJson[i].notices[j],
          },
          store: newStore.id,
          image_keywords: null
        };
        setStatePhrase(`${i18n.t('creating')}: ${i18n.t('notice')}`);
        setSourcePhrase(`(${storeNotice.article.title})`);
        const imageList = await getImageListFromUnsplash(storesJson[i].notices[j].image_keywords[0]);
        await createStoreNotice(storeNotice, imageList);
      };

    }

    for (let i = 0; i < centralNoticesJson.length; i++) {
      const centralNotice = {
        article: {
          ...centralNoticesJson[i]
        },
        image_keywords: null
      };
      setStatePhrase(`${i18n.t('creating')}: ${i18n.t('notice')}`);
      setSourcePhrase(`(${centralNotice.article.title})`);
      const imageList = await getImageListFromUnsplash(centralNoticesJson[i].image_keywords[0]);
      await createCentralNotice(centralNotice, imageList);
    };

    setRequestedCount(allRequestCount);
    setStatePhrase(i18n.t('_databaseSuccessfullyCreated'));
    setSourcePhrase('');
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
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
            <Typography align='center'>{statePhrase}</Typography>
            <Typography align='center'>{sourcePhrase}</Typography>
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
              await new Promise(r => setTimeout(r, 2500));
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
