import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
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
import NoticeListItem from 'components/NoticeListItem';
import Tile from 'components/Tile';
import ReviewListItem from 'components/ReviewListItem';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

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

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeResponse = await getStore(context);
  if (storeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeNoticeListResponse = await getStoreNoticeList(context, storeResponse.data);
  const productListResponse = await getProductList(context, storeResponse.data);
  const storeReviewListResponse = await getStoreReviewList(context, storeResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      store: storeResponse.data,
      storeNoticeList: storeNoticeListResponse.data.results,
      productList: productListResponse.data.results,
      storeReviewList: storeReviewListResponse.data.results
    }
  }
})

const latitude = 37.506502;
const longitude = 127.053617;

function Id({ lng, lngDict, selfUser, store, storeNoticeList, productList, storeReviewList }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
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
              <Tile image={constants.NO_IMAGE_PATH} />
            )
          }
        </SwipeableTileList>
        <Box padding={1}>
          <Box display='flex' flexWrap='wrap' marginBottom={1}>
            {
              store.tags && (store.tags.length > 0) && store.tags.map((item, index) => (
                <Box
                  key={index}
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
          </Box>
          <Divider />
          <Box marginTop={1}>
            <Typography>{store.description}</Typography>
          </Box>
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
              <NoticeListItem
                title={item.article.title}
                subtitle={new Date(item.article.created_at).toLocaleDateString()}
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
      >
        {productList.length > 0 ? (
          <Grid container spacing={1}>
            {productList && productList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  margin={false}
                  title={item.name}
                  subtitle={item.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
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
            storeReviewList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
              <>
                <ReviewListItem
                  key={index}
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
          <KakaoMapBox latitude={latitude} longitude={longitude}/>
        </Card>
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
