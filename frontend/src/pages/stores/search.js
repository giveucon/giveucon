import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

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
    color: theme.palette.favorite.main,
    '&:hover': {
      color: theme.palette.favorite.dark,
    },
  },
}));

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
  return {
    props: {
      lng,
      lngDict,
      selfUser
    }
  }
})

function Search({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [keywords, setKeywords] = useState({
    name: null,
    tagName: null
  });
  const [storeList, setStoreList] = useState([]);
  const [storeListpage, setStoreListpage] = useState(1);
  const [hasMoreStoreList, setHasMoreStoreList] = useState(true);

  const getStoreList = async () => {
    const params = {
      name: keywords.name || null,
      tags__name: keywords.tagName || null,
    };
    const getStoreListResponse = await requestToBackend(null, 'api/stores/', 'get', 'json', null, params);
    if (getStoreListResponse.status === 200) {
      for (const store of getStoreListResponse.data.results) {
        const favoriteStoreResponse = await getFavoriteStore(null, selfUser, store);
        store.favorite = (favoriteStoreResponse.data.results.length === 1) ? favoriteStoreResponse.data.results[0] : null
      }
      setStoreList(prevStoreList => getStoreListResponse.data.results);
      setStoreListpage(prevStoreListpage => 1);
      if (getStoreListResponse.data.next === null) setHasMoreStoreList(prevHasMoreStoreList => false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  };

  const getMoreStoreList = async () => {
    const params = {
      name: keywords.name || null,
      tags__name: keywords.tagName || null,
      page: storeListpage + 1,
    };
    const getStoreListResponse = await requestToBackend(null, 'api/stores/', 'get', 'json', null, params);
    if (getStoreListResponse.status === 200) {
      for (const store of getStoreListResponse.data.results) {
        const favoriteStoreResponse = await getFavoriteStore(null, selfUser, store);
        store.favorite = (favoriteStoreResponse.data.results.length === 1) ? favoriteStoreResponse.data.results[0] : null
      }
      setStoreList(prevStoreList => prevStoreList.concat(getStoreListResponse.data.results));
      setStoreListpage(prevStoreListpage => prevStoreListpage + 1);
      if (getStoreListResponse.data.next === null) setHasMoreStoreList(prevHasMoreStoreList => false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('searchStores')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('searchStores')}
      />


      <Section
        title={i18n.t('keywords')}
        titlePrefix={<IconButton><VpnKeyIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={keywords.name}
            fullWidth
            label={i18n.t('name')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setKeywords(prevKeywords => ({ ...prevKeywords, name: event.target.value }));
            }}
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='tag'
            value={keywords.tagName}
            fullWidth
            label={i18n.t('tag')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setKeywords(prevKeywords => ({ ...prevKeywords, tagName: event.target.value }));
            }}
          />
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const getStoreListResult = await getStoreList(keywords);
            }}
          >
            {i18n.t('searchStores')}
          </Button>
        </Box>
      </Section>

      <Section
        title={i18n.t('searchResults')}
        titlePrefix={<IconButton><SearchIcon /></IconButton>}
      >
        {storeList.length > 0 ? (
          <InfiniteScroll
            dataLength={storeList.length}
            next={getMoreStoreList}
            hasMore={hasMoreStoreList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {storeList.map((item, index) => (
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
    </Layout>
  );
}

export default Search;
