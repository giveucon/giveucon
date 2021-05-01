import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StorefrontIcon from '@material-ui/icons/Storefront';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/use-i18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStoreList = async (context) => {
  return await requestToBackend(context, 'api/stores/', 'get', 'json');
};

const getSelfStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id,
  }
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeListResponse = await getStoreList(context);
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
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
    <Layout title={`${i18n.t('pages.stores.index.pageTitle')} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={i18n.t('pages.stores.index.pageTitle')}
      >
      </Section>
      <Section
        title={i18n.t('pages.stores.index.myStore')}
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
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
        { selfStoreList.results.length > 0 ? (
          <Grid container spacing={1}>
            {selfStoreList.results.slice(0, 4).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                  onClick={() => router.push(`/${lng}/stores/${item.id}/` )}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('pages.stores.index.noStore')} variant='information' />
        )}
      </Section>
      <Section
        title={i18n.t('pages.stores.index.allStores')}
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
        titleSuffix={
          <IconButton onClick={() => router.push('/stores/list/')}>
            <ArrowForwardIcon />
          </IconButton>}
        padding={false}
      >
        {(storeList.results.length > 0) ? (
          <SwipeableTileList half>
            {storeList.results.slice(0, 10).map((item, index) => {
              return <Tile
                key={index}
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                actions={[
                  <IconButton><FavoriteIcon /></IconButton>
                ]}
                onClick={() => router.push(`/stores/${item.id}/`)}
              />
            })}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('common.dialogs.empty')} variant='information' />
        )}
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push('/stores/create/')}
        >
          {i18n.t('pages.stores.index.createStore')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Index;
