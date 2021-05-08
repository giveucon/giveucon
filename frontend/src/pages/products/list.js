import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
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
    color: theme.palette.favorite.main,
    '&:hover': {
      color: theme.palette.favorite.dark,
    },
  },
}));

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

const getFavoriteProduct = async (context, selfUser, product) => {
  return await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, {
    user: selfUser.id,
    product: product.id
  });
};

const postFavoriteProduct = async (product) => {
  return await requestToBackend(null, 'api/favorite-products/', 'post', 'json', {
    product: product.id
  }, null);
};

const deleteFavoriteProduct = async (favoriteProduct) => {
  return await requestToBackend(null, `api/favorite-products/${favoriteProduct.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialProductListResponse = await getProductList(context);
  for (const product of initialProductListResponse.data.results) {
    const favoriteProductResponse = await getFavoriteProduct(context, selfUser, product);
    product.favorite = (favoriteProductResponse.data.results.length === 1) ? favoriteProductResponse.data.results[0] : null
  }
  const userResponse = context.query.user && await getUser(context);
  const storeResponse = context.query.store && await getStore(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialProductListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null
    }
  }
})

function List({ lng, lngDict, selfUser, initialProductListResponse, user, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [productList, setProductList] = useState(initialProductListResponse.data.results);
  const [productListpage, setProductListpage] = useState(1);
  const [hasMoreProductList, setHasMoreProductList] = useState(initialProductListResponse.data.next);

  const getMoreProductList = async () => {
    const productListResponse = await requestToBackend(null, 'api/products/', 'get', 'json', null, {
      user: user ? user.id : null,
      store: store ? store.id : null,
      page: productListpage + 1,
    });
    for (const product of productListResponse.data.results) {
      const favoriteProductResponse = await getFavoriteProduct(null, selfUser, product);
      product.favorite = (favoriteProductResponse.data.results.length === 1) ? favoriteProductResponse.data.results[0] : null
    }
    setProductList(prevProductList => (prevProductList || []).concat(productListResponse.data.results));
    setProductListpage(prevProductListpage => prevProductListpage + 1);
    if (productListResponse.data.next === null) setHasMoreProductList(prevHasMoreProductList => false);
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('productList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('productList')}
        padding={false}
      >
        {(productList.length > 0) ? (
          <InfiniteScroll
            dataLength={productList.length}
            next={getMoreProductList}
            hasMore={hasMoreProductList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {productList && productList.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile
                    title={item.name}
                    subtitle={`${item.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                    image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                    onClick={() => router.push(`/products/${item.id}/`)}
                    actions={[
                      <IconButton className={item.favorite ? classes.favoriteButton : null}>
                        <FavoriteIcon
                          onClick={async () => {
                            if (!item.favorite) {
                              const postFavoriteProductResult = await postFavoriteProduct(item);
                              if (postFavoriteProductResult.status === 201) {
                                setProductList(productList.map(product => 
                                  product.id === item.id 
                                  ? {...product, favorite: postFavoriteProductResult.data} 
                                  : product 
                                ));
                              }
                              else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                            } else {
                              const deleteFavoriteProductResult = await deleteFavoriteProduct(item.favorite);
                              if (deleteFavoriteProductResult.status === 204) {
                                setProductList(productList.map(product => 
                                  product.id === item.id 
                                  ? {...product, favorite: null} 
                                  : product 
                                ));
                              }
                              else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                            }
                          }}
                        />
                      </IconButton>
                    ]}
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
