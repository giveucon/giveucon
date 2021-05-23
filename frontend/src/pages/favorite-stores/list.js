import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
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

const getFavoriteStoreList = async (context) => {
  const params = {
    user: context.query.user || null,
  };
  return await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, params);
};

const getUser = async (context) => await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialFavoriteStoreListResponse = await getFavoriteStoreList(context);
  if (initialFavoriteStoreListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const userResponse = context.query.user ? await getUser(context) : null;
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialFavoriteStoreListResponse,
      user: context.query.user ? userResponse.data : null
     }
  }
})

function List({ lng, lngDict, selfUser, initialFavoriteStoreListResponse, user }) {

  const i18n = useI18n();
  const router = useRouter();
  const [favoriteStoreList, setFavoriteStoreList] = useState(initialFavoriteStoreListResponse.data.results);
  const [favoriteStoreListpage, setFavoriteStoreListpage] = useState(1);
  const [hasMoreFavoriteStoreList, setHasMoreFavoriteStoreList] = useState(initialFavoriteStoreListResponse.data.next);

  const getMoreFavoriteStoreList = async () => {
    const params = {
      user: user ? user.id : null,
      page: favoriteStoreListpage + 1,
    };
    const favoriteStoreListResponse = await requestToBackend(null, 'api/favorite-stores/', 'get', 'json', null, params);
    setFavoriteStoreList(prevFavoriteStoreList => prevFavoriteStoreList.concat(favoriteStoreListResponse.data.results));
    setFavoriteStoreListpage(prevFavoriteStoreListpage => prevFavoriteStoreListpage + 1);
    if (favoriteStoreListResponse.data.next === null) setHasMoreFavoriteStoreList(prevHasMoreFavoriteStoreList => false);
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('favoriteStoreList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('favoriteStoreList')}
        padding={false}
      >
        {(favoriteStoreList.length > 0) ? (
          <InfiniteScroll
            dataLength={favoriteStoreList.length}
            next={getMoreFavoriteStoreList}
            hasMore={hasMoreFavoriteStoreList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {favoriteStoreList && favoriteStoreList.map((item, index) => (
                <Grid item xs={6} key={item.id}>
                  <Tile
                    title={item.store.name}
                    image={item.store.images.length > 0 ? item.store.images[0].image : constants.NO_IMAGE_PATH}
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

export default List;
