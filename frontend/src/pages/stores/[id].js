import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RateReviewIcon from '@material-ui/icons/RateReview';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import KakaoMapBox from 'components/KakaoMapBox';
import Layout from 'components/Layout';
import ListItem from 'components/ListItem';
import Tile from 'components/Tile';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
  favoriteButton: {
    color: theme.palette.favorite.main,
    '&:hover': {
      color: theme.palette.favorite.dark,
    },
  },
}));

const getStore = async (context) => await requestToBackend(context, `api/stores/${context.query.id}/`, 'get', 'json');

const getStoreNoticeList = async (context, store) => {
  const params = {
    store: store.id
  };
  return await requestToBackend(context, 'api/store-notices/', 'get', 'json', null, params);
};

const getProductList = async (context, store) => {
  const params = {
    store: store.id
  };
  return await requestToBackend(context, 'api/products/', 'get', 'json', null, params);
};

const getStoreReviewList = async (context, store) => {
  const params = {
    store: store.id
  };
  return await requestToBackend(context, 'api/store-reviews/', 'get', 'json', null, params);
};

const getFavoriteStore = async (context, selfUser) => await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, {
    user: selfUser.id,
    store: context.query.id
  });

const postFavoriteStore = async (store) => await requestToBackend(null, 'api/favorite-stores/', 'post', 'json', {
    store: store.id
  }, null);

const deleteFavoriteStore = async (favoriteStore) => await requestToBackend(null, `api/favorite-stores/${favoriteStore.id}/`, 'delete', 'json');

const getFavoriteProduct = async (context, selfUser, product) => await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, {
    user: selfUser.id,
    product: product.id
  });

const postFavoriteProduct = async (product) => await requestToBackend(null, 'api/favorite-products/', 'post', 'json', {
    product: product.id
  }, null);

const deleteFavoriteProduct = async (favoriteProduct) => await requestToBackend(null, `api/favorite-products/${favoriteProduct.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
  if (storeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeNoticeListResponse = await getStoreNoticeList(context, storeResponse.data);
  const productListResponse = await getProductList(context, storeResponse.data);
  for (const product of productListResponse.data.results) {
    const favoriteProductResponse = await getFavoriteProduct(context, selfUser, product);
    product.favorite = (favoriteProductResponse.data.results.length === 1) ? favoriteProductResponse.data.results[0] : null
  }
  const storeReviewListResponse = await getStoreReviewList(context, storeResponse.data);
  const favoriteStoreResponse = await getFavoriteStore(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      store: storeResponse.data,
      storeNoticeList: storeNoticeListResponse.data.results,
      productList: productListResponse.data.results,
      storeReviewList: storeReviewListResponse.data.results,
      favoriteStore: (favoriteStoreResponse.data.results.length === 1) ? favoriteStoreResponse.data.results[0] : null
    }
  }
})

function Id({
  lng,
  lngDict,
  selfUser,
  store,
  storeNoticeList,
  productList: _productList,
  storeReviewList,
  favoriteStore: _favoriteStore
}) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [productList, setProductList] = useState(_productList)
  const [favoriteStore, setFavoriteStore] = useState(_favoriteStore)

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${store.name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={store.name}
        padding={false}
      >
        <SwipeableTileList autoplay>
          {store.images && (store.images.length > 0) ? (
            store.images.map((item) => <Tile
                key={item.id}
                image={item.image}
              />)
            ) : (
              <Tile image={constants.NO_IMAGE_PATH} />
            )
          }
        </SwipeableTileList>
        <Box padding={1}>
          <Box display='flex' flexWrap='wrap' marginBottom={store.tags && (store.tags.length > 0) ? 1 : 0}>
            {
              store.tags && (store.tags.length > 0) && store.tags.map((item, index) => (
                <Box
                  key={item.id}
                  marginLeft={index > 0 ? '0.25rem' : '0rem'}
                  marginRight={index < store.tags.length ? '0.25rem' : '0rem'}
                >
                  <Chip
                    label={item.name}
                    color='primary'
                    size='small'
                    variant='outlined'
                    // onClick={() => router.push(`/tags/${item.id}/`)}
                  />
                </Box>
              ))
            }
            <Divider />
          </Box>
          <Box marginTop={store.tags && (store.tags.length > 0) ? 1 : 0}>
            <Typography>{store.description}</Typography>
          </Box>
          {selfUser.id !== store.user && (
            <>
              {!favoriteStore && (
                <Box marginY={1}>
                  <Button
                    color='primary'
                    fullWidth
                    variant='contained'
                    onClick={async () => {
                      const postFavoriteStoreResult = await postFavoriteStore(store);
                      if (postFavoriteStoreResult.status === 201) setFavoriteStore(postFavoriteStoreResult.data);
                      else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                    }}
                  >
                    {i18n.t('addFavoriteStore')}
                  </Button>
                </Box>
              )}
              {favoriteStore && (
                <Box marginY={1}>
                  <Button
                    className={classes.errorButton}
                    fullWidth
                    variant='contained'
                    onClick={async () => {
                      const deleteFavoriteStoreResult = await deleteFavoriteStore(favoriteStore);
                      if (deleteFavoriteStoreResult.status === 204) setFavoriteStore(null);
                      else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                    }}
                  >
                    {i18n.t('deleteFavoriteStore')}
                  </Button>
                </Box>
              )}
              <Box marginY={1}>
                <Button
                  className={classes.errorButton}
                  fullWidth
                  variant='contained'
                  onClick={() => router.push({
                    pathname: '/reports/create/',
                    query: { user: store.user },
                  })}
                >
                  {i18n.t('reportSeller')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Section>


      <Section
        title={i18n.t('notices')}
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/store-notices/list/',
              query: { store: store.id },
            })}
          >
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {storeNoticeList.length > 0 ? (
          storeNoticeList.slice(0, constants.TILE_LIST_SLICE_NUMBER).map((item, index) => (
            <>
              <ListItem
                variant='notice'
                title={item.article.title}
                subtitle={item.article.created_at}
                onClick={() => router.push(`/store-notices/${item.id}/`)}
              />
              {index < storeNoticeList.slice(0, constants.LIST_SLICE_NUMBER).length - 1 && (<Divider />)}
            </>
          ))
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('products')}
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/products/list/',
              query: { store: store.id },
            })}
          >
            <ArrowForwardIcon />
          </IconButton>
        }
        padding={false}
      >
        {productList.length > 0 ? (
          <SwipeableTileList half>
            {productList && productList.map((item) => (
              <Tile
                key={item.id}
                title={item.name}
                subtitle={`${item.price}${i18n.t('_currencyBTC')}`}
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
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('reviews')}
        titlePrefix={<IconButton><RateReviewIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/store-reviews/list/',
              query: { store: store.id },
            })}
          >
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {storeReviewList.length > 0 ? (
            storeReviewList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
              <>
                <ListItem
                  key={item.id}
                  variant='review'
                  title={item.review.article.title}
                  date={new Date(item.review.article.created_at)}
                  score={item.review.score}
                  onClick={() => router.push(`/store-reviews/${item.id}/`)}
                />
                {index < storeReviewList.slice(0, constants.LIST_SLICE_NUMBER).length - 1 && (<Divider />)}
              </>
            ))
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-reviews/create/',
              query: { store: store.id },
            })}
          >
            {i18n.t('addReview')}
          </Button>
        </Box>
      </Section>


      <Section
        title={i18n.t('location')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
        <Card>
          <KakaoMapBox
            location={store.location}
          />
        </Card>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`https://map.kakao.com/link/to/${store.name},${store.location.latitude},${store.location.longitude}`)}
          >
            {i18n.t('findPath')}
          </Button>
        </Box>
      </Section>


      {selfUser && store && (selfUser.id === store.user) && (
        <Section
          title={i18n.t('managements')}
          titlePrefix={<IconButton><SettingsIcon /></IconButton>}
        >
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
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/store-notices/create/',
                query: { store: store.id },
              })}
            >
              {i18n.t('addNotice')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/stores/update/',
                query: { store: store.id },
              })}
            >
              {i18n.t('editStore')}
            </Button>
          </Box>
        </Section>
      )}


    </Layout>
  );
}

export default Id;
