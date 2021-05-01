import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import AlertBox from 'components/AlertBox';
import KakaoMapBox from 'components/KakaoMapBox';
import Layout from 'components/Layout'
import NoticeListItem from 'components/NoticeListItem'
import ReviewListItem from 'components/ReviewListItem'
import Tile from 'components/Tile';
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.id}/`, 'get', 'json');
};

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

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
  const storeNoticeListResponse = await getStoreNoticeList(context, storeResponse.data);
  const productListResponse = await getProductList(context, storeResponse.data);
  const storeReviewListResponse = await getStoreReviewList(context, storeResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      store: storeResponse.data,
      storeNoticeList: storeNoticeListResponse.data,
      productList: productListResponse.data,
      storeReviewList: storeReviewListResponse.data,
    },
  };
})

const latitude = 37.506502;
const longitude = 127.053617;

function Id({ lng, lngDict, selfUser, store, storeNoticeList, productList, storeReviewList }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={selfUser.locale}
      menuItemValueList={selfUser.menuItems}
      title={`${store.name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={store.name}
        padding={false}
      >
        <SwipeableTileList autoplay={true}>
          {store.images && (store.images.length > 0) ? (
            store.images.map((item, index) => {
              return <Tile
                key={index}
                image={item.image}
                onClick={() => router.push(`/images/${item.id}/`)}
              />})
            ) : (
              <Tile image='/no_image.png' />
            )
          }
        </SwipeableTileList>
        <Box padding={1}>
          {
            store.tags && (store.tags.length > 0) && store.tags.map((item, index) => (
              <Chip
                key={index}
                label={item.name}
                color='primary'
                size='small'
                variant='outlined'
                // onClick={() => router.push(`/tags/${item.id}/`)}
              />
            ))
          }
        </Box>
        <Box padding={1}>
          <Typography>{store.description}</Typography>
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
          <Grid container spacing={1}>
            {storeNoticeList.slice(0, 4).map((item, index) => (
              <Grid item xs={12} key={index}>
                <NoticeListItem
                  title={item.article.title}
                  subtitle={new Date(item.article.created_at).toLocaleDateString()}
                  onClick={() => router.push(`/store-notices/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
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
      >
        {productList.length > 0 ? (
          <Grid container spacing={1}>
            {productList && productList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  margin={false}
                  title={item.name}
                  subtitle={item.price.toLocaleString('ko-KR') + '원'}
                  image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                  actions={[
                    <IconButton><FavoriteIcon /></IconButton>
                  ]}
                  onClick={() => router.push(`/products/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
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
          <Grid container spacing={1}>
            {storeReviewList.slice(0, 4).map((item, index) => (
              <Grid item xs={12} key={index}>
                <ReviewListItem
                  title={item.review.article.title}
                  subtitle={new Date(item.review.article.created_at).toLocaleDateString()}
                  score={item.review.score}
                  onClick={() => router.push(`/store-reviews/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      <Section
        title={i18n.t('location')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
        <Card>
          <KakaoMapBox latitude={latitude} longitude={longitude}/>
        </Card>
      </Section>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`https://map.kakao.com/link/map/${latitude},${longitude}`)}
        >
          {i18n.t('findPath')}
        </Button>
      </Box>
      {selfUser && store && (selfUser.id === store.user) && (
        <>
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
        </>
      )}
    </Layout>
  );
}

export default Id;
