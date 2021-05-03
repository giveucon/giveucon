import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RateReviewIcon from '@material-ui/icons/RateReview';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import ReviewListItem from 'components/ReviewListItem'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, product) => {
  return await requestToBackend(context, `api/stores/${product.store}/`, 'get', 'json');
};

const getProductReviewList = async (context) => {
  return await requestToBackend(context, `api/product-reviews/`, 'get', 'json', null, {
    product: context.query.id
  });
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  const storeResponse = await getStore(context, productResponse.data);
  const productReviewListResponse = await getProductReviewList(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      product: productResponse.data,
      store: storeResponse.data,
      productReviewList: productReviewListResponse.data
    },
  };
})

function Id({ lng, lngDict, selfUser, product, store, productReviewList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${product.name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={product.name}
        padding={false}
      >
        <SwipeableTileList autoplay={true}>
          {product.images && (product.images.length > 0) ?
            (product.images.map((item, index) => {
              return <Tile
                key={index}
                image={item.image}
                onClick={() => router.push(`/images/${item.id}/` )}
              />
            })
          ) : (
            [<Tile image={constants.NO_IMAGE_PATH}/>]
          )}
        </SwipeableTileList>
        <Box padding={1}>
          <Box marginBottom={1}>
            <Typography variant='h5'>{product.name}</Typography>
            <Typography variant='h6'>{`${(product.price || 0).toLocaleString('ko-KR')}원`}</Typography>
          </Box>
          <Divider />
          <Box marginTop={1}>
            <Typography variant='body1'>{product.description}</Typography>
          </Box>
        </Box>
      </Section>
      <Section
        title={i18n.t('reviews')}
        titlePrefix={<IconButton><RateReviewIcon /></IconButton>}
        titleSuffix={
          <IconButton
            onClick={() => router.push({
              pathname: '/product-reviews/list/',
              query: { product: product.id },
            })}
          >
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {productReviewList.length > 0 ? (
          <Grid container spacing={1}>
            {productReviewList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
              <Grid item xs={12} key={index}>
                <ReviewListItem
                  title={item.review.article.title}
                  subtitle={new Date(item.review.article.created_at).toLocaleDateString()}
                  score={item.review.score}
                  onClick={() => router.push(`/product-reviews/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      {(selfUser.id !== store.owner) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupons/issue/',
              query: { product: product.id },
            })}
          >
            {i18n.t('issueCoupon')}
          </Button>
        </Box>
      )}
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/product-reviews/create/',
            query: { product: product.id },
          })}
        >
          {i18n.t('addReview')}
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/stores/${store.id}/`,)}
        >
          {i18n.t('goToStore')}
        </Button>
      </Box>
      {(selfUser.id === store.user) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/update/',
              query: { product: product.id },
            })}
          >
            {i18n.t('editProduct')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
