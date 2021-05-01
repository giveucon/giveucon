import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getProductList = async (context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
  };
  return await requestToBackend(context, 'api/products', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialProductListResponse = await getProductList(context);
  const userResponse = context.query.user && await getUser(context);
  const storeResponse = context.query.store && await getStore(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialProductListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null,
    },
  };
})

function List({ lng, lngDict, selfUser, initialProductListResponse, user, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const [productList, setProductList] = useState(initialProductListResponse.data.results);
  const [productListPagination, setProductListPagination] = useState(0);
  const [hasMoreProductList, setHasMoreProductList] = useState(initialProductListResponse.data.next);

  const getMoreProductList = async () => {
    const productListResponse = await await requestToBackend('api/products/', 'get', 'json', null, {
      user: user ? user.id : null,
      store: store ? store.id : null,
      page: productListPagination + 1,
    });
    setProductList(prevProductList => (prevProductList || []).concat(productListResponse.data.results));
    setProductListPagination(prevProductListPagination => prevProductListPagination + 1);
    if (productListPagination.data.next === null) setHasMoreProductList(prevHasMoreProductList => false);
  }

  return (
    <Layout
      locale={selfUser.locale}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('productList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('productList')}
      >
        {(productList.length > 0) ? (
          <InfiniteScroll
            dataLength={productList.length}
            next={getMoreProductList}
            hasMore={hasMoreProductList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container spacing={1}>
              {productList && productList.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile
                    title={item.name}
                    subtitle={`${item.price.toLocaleString('ko-KR')}${i18n.t('_localeCurrencyKoreanWon')}`}
                    image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                    actions={[
                      <IconButton><FavoriteIcon /></IconButton>
                    ]}
                    onClick={() => router.push(`/products/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      {store && (selfUser.id === store.user) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/create/',
              query: { id: store.id },
            })}
          >
            {i18n.t('addProduct')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
