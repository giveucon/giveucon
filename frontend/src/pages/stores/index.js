import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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

const useStyles = makeStyles((theme) => ({
  favoriteButton: {
    color: theme.palette.favorite.main,
    '&:hover': {
      color: theme.palette.favorite.dark,
    },
  },
}));

const getStoreList = async (context) => await requestToBackend(context, 'api/stores/', 'get', 'json');

const getSelfStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id,
  }
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

const getStoreFavorite = async (context, selfUser, store) => await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, {
  user: selfUser.id,
  store: store.id
});

const getSelfFavoriteStoreList = async (context, selfUser) => await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, {
    user: selfUser.id
  });

const postFavoriteStore = async (store) => await requestToBackend(null, 'api/favorite-stores/', 'post', 'json', {
    store: store.id
  }, null);

const deleteFavoriteStore = async (favoriteStore) => await requestToBackend(null, `api/favorite-stores/${favoriteStore.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeListResponse = await getStoreList(context);
  if (storeListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  for (const store of storeListResponse.data.results) {
    const favoriteStoreResponse = await getStoreFavorite(context, selfUser, store);
    store.favorite = (favoriteStoreResponse.data.count === 1) ? favoriteStoreResponse.data.results[0] : null
  }
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
  if (selfStoreListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const selfFavoriteStoreListResponse = await getSelfFavoriteStoreList(context, selfUser);
  if (selfFavoriteStoreListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeList: storeListResponse.data.results,
      selfStoreList: selfStoreListResponse.data.results,
      selfFavoriteStoreList: selfFavoriteStoreListResponse.data.results
    },
  };
})

function Index({ lng, lngDict, selfUser, storeList: _storeList, selfStoreList, selfFavoriteStoreList }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [storeList, setStoreList] = useState(_storeList);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('stores')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('stores')}
       />


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
        padding={false}
      >
        {selfStoreList.length > 0 ? (
          <SwipeableTileList half>
            {selfStoreList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                onClick={() => router.push(`/stores/${item.id}/` )}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('myFavoriteStores')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/favorite-stores/list/',
              query: { user: selfUser.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
        padding={false}
      >
        {selfFavoriteStoreList && selfFavoriteStoreList.length > 0 ? (
          <SwipeableTileList half>
            {selfFavoriteStoreList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                onClick={() => router.push(`/stores/${item.id}/` )}
              />
            ))}
          </SwipeableTileList>
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
        {(storeList.length > 0) ? (
          <SwipeableTileList half>
            {storeList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                key={item.id}
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                actions={[
                  <IconButton className={item.favorite ? classes.favoriteButton : null}>
                    <FavoriteIcon
                      onClick={async () => {
                        if (!item.favorite) {
                          const postFavoriteStoreResult = await postFavoriteStore(item);
                          if (postFavoriteStoreResult.status === 201) {
                            setStoreList(storeList.map(store =>
                              store.id === item.id
                              ? {...store, favorite: postFavoriteStoreResult.data}
                              : store
                            ));
                          }
                          else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                        } else {
                          const deleteFavoriteStoreResult = await deleteFavoriteStore(item.favorite);
                          if (deleteFavoriteStoreResult.status === 204) {
                            setStoreList(storeList.map(store =>
                              store.id === item.id
                              ? {...store, favorite: null}
                              : store
                            ));
                          }
                          else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                        }
                      }}
                    />
                  </IconButton>
                ]}
                onClick={() => router.push(`/stores/${item.id}/`)}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push('/stores/search/')}
        >
          {i18n.t('searchStores')}
        </Button>
      </Box>


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
