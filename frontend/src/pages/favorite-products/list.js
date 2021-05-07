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
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getFavoriteProductList = async (context) => {
  const params = {
    user: context.query.user || null,
  };
  return await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialFavoriteProductListResponse = await getFavoriteProductList(context);
  if (initialFavoriteProductListResponse.status === 404) {
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
      initialFavoriteProductListResponse,
      user: context.query.user ? userResponse.data : null
     }
  }
})

function List({ lng, lngDict, selfUser, initialFavoriteProductListResponse, user }) {

  const i18n = useI18n();
  const router = useRouter();
  const [favoriteProductList, setFavoriteProductList] = useState(initialFavoriteProductListResponse.data.results);
  const [favoriteProductListpage, setFavoriteProductListpage] = useState(1);
  const [hasMoreFavoriteProductList, setHasMoreFavoriteProductList] = useState(initialFavoriteProductListResponse.data.next);

  const getMoreFavoriteProductList = async () => {
    const params = {
      user: user ? user.id : null,
      page: favoriteProductListpage + 1,
    };
    const favoriteProductListResponse = await requestToBackend(null, 'api/favorite-products/', 'get', 'json', null, params);
    setFavoriteProductList(prevFavoriteProductList => prevFavoriteProductList.concat(favoriteProductListResponse.data.results));
    setFavoriteProductListpage(prevFavoriteProductListpage => prevFavoriteProductListpage + 1);
    if (productListResponse.data.next === null) setHasMoreFavoriteProductList(prevHasMoreFavoriteProductList => false);
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('favoriteProductList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('favoriteProductList')}
      >
        {(favoriteProductList.length > 0) ? (
          <InfiniteScroll
            dataLength={favoriteProductList.length}
            next={getMoreFavoriteProductList}
            hasMore={hasMoreFavoriteProductList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container spacing={1}>
              {favoriteProductList && favoriteProductList.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile
                    title={item.product.name}
                    image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                    onClick={() => router.push(`/products/${item.product.id}/`)}
                    menuItems={
                      <MenuItem>Menu Item</MenuItem>
                    }
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
