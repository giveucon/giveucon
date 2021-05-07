import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const useStyles = makeStyles((theme) => ({
  favoriteButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getStoreList = async (context) => {
  const params = {
    user: context.query.user || null,
  };
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

const getFavoriteStore = async (context, selfUser, store) => {
  return await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, {
    user: selfUser.id,
    store: store.id
  });
};

const postFavoriteStore = async (store) => {
  return await requestToBackend(null, 'api/favorite-stores/', 'post', 'json', {
    store: store.id
  }, null);
};

const deleteFavoriteStore = async (favoriteStore) => {
  return await requestToBackend(null, `api/favorite-stores/${favoriteStore.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialStoreListResponse = await getStoreList(context);
  if (initialStoreListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  for (const store of initialStoreListResponse.data.results) {
    const favoriteStoreResponse = await getFavoriteStore(context, selfUser, store);
    store.favorite = (favoriteStoreResponse.data.results.length === 1) ? favoriteStoreResponse.data.results[0] : null
  }
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
  const classes = useStyles();
  const [storeList, setStoreList] = useState(initialStoreListResponse.data.results);
  const [storeListpage, setStoreListpage] = useState(1);
  const [hasMoreStoreList, setHasMoreStoreList] = useState(initialStoreListResponse.data.next);

  const getMoreStoreList = async () => {
    const params = {
      user: user ? user.id : null,
      page: storeListpage + 1,
    };
    const storeListResponse = await requestToBackend(null, 'api/stores/', 'get', 'json', null, params);
    for (const store of storeListResponse.data.results) {
      const favoriteStoreResponse = await getFavoriteStore(context, selfUser, store);
      store.favorite = (favoriteStoreResponse.data.results.length === 1) ? favoriteStoreResponse.data.results[0] : null
    }
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
