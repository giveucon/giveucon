import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getStoreList = async (context) => {
  const params = {
    user: context.query.user || null,
  };
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialStoreListResponse = await getStoreList(context);
  const userResponse = context.query.user ? await getUser(context) : null;
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialStoreListResponse,
      user: context.query.user ? userResponse.data : null
     }
  }
})

function List({ lng, lngDict, selfUser, initialStoreListResponse, user }) {

  const i18n = useI18n();
  const router = useRouter();
  const [storeList, setStoreList] = useState(initialStoreListResponse.data.results);
  const [storeListpage, setStoreListpage] = useState(1);
  const [hasMoreStoreList, setHasMoreStoreList] = useState(initialStoreListResponse.data.next);

  const getMoreStoreList = async () => {
    const params = {
      user: user ? user.id : null,
      page: storeListpage + 1,
    };
    const storeListResponse = await requestToBackend(null, 'api/stores/', 'get', 'json', null, params);
    setStoreList(prevStoreList => prevStoreList.concat(storeListResponse.data.results));
    setStoreListpage(prevStoreListpage => prevStoreListpage + 1);
    if (storeListResponse.data.next === null) setHasMoreStoreList(prevHasMoreStoreList => false);
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('storeList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('storeList')}
      >
        {(storeList.length > 0) ? (
          <InfiniteScroll
            dataLength={storeList.length}
            next={getMoreStoreList}
            hasMore={hasMoreStoreList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container spacing={1}>
              {storeList && storeList.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile
                    title={item.name}
                    image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                    onClick={() => router.push(`/stores/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      {user && (user.id === selfUser.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push('/stores/create/')}
          >
            {i18n.t('addStore')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
