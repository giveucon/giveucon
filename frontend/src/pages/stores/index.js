import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StoreIcon from '@material-ui/icons/Store';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getStoreList = async (context) => {
  return await requestToBackend(context, 'api/stores/', 'get', 'json');
};

const getSelfStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id,
  }
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeListResponse = await getStoreList(context);
  if (storeListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
  if (selfStoreListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeList: storeListResponse.data,
      selfStoreList: selfStoreListResponse.data
    },
  };
})

function Index({ lng, lngDict, selfUser, storeList, selfStoreList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('stores')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('stores')}
      >
      </Section>


      <Section
        title={i18n.t('myStores')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton 
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {selfStoreList.results.length > 0 ? (
          <Grid container spacing={1}>
            {selfStoreList.results.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/stores/${item.id}/` )}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('allStores')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton onClick={() => router.push('/stores/list/')}>
            <ArrowForwardIcon />
          </IconButton>}
        padding={false}
      >
        {(storeList.results.length > 0) ? (
          <SwipeableTileList half>
            {storeList.results.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => {
              return <Tile
                key={index}
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                actions={[
                  <IconButton><FavoriteIcon /></IconButton>
                ]}
                onClick={() => router.push(`/stores/${item.id}/`)}
              />
            })}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


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


    </Layout>
  );
}

export default Index;
