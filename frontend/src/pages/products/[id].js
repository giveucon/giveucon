import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RateReviewIcon from '@material-ui/icons/RateReview';
import SettingsIcon from '@material-ui/icons/Settings';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import ListItem from 'components/ListItem'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.id}/`, 'get', 'json');

const getProductReviewList = async (context) => await requestToBackend(context, `api/product-reviews/`, 'get', 'json', null, {
  product: context.query.id
});
const getCouponList = async (context, product) => await requestToBackend(context, `api/coupons/`, 'get', 'json', null, {
  user: product.store.user,
  used: false
});

const getFavoriteProduct = async (context, selfUser) => await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, {
  user: selfUser.id,
  product: context.query.id
});

const postFavoriteProduct = async (product) => await requestToBackend(null, 'api/favorite-products/', 'post', 'json', {
  product: product.id
}, null);

const deleteFavoriteProduct = async (favoriteProduct) => await requestToBackend(null, `api/favorite-products/${favoriteProduct.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  if (productResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const couponListResponse = await getCouponList(context, productResponse.data);
  const productReviewListResponse = await getProductReviewList(context);
  const initialFavoriteProductResponse = await getFavoriteProduct(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      product: productResponse.data,
      couponListResponse,
      productReviewList: productReviewListResponse.data.results,
      initialFavoriteProduct: (initialFavoriteProductResponse.data.results.length === 1) ? initialFavoriteProductResponse.data.results[0] : null
    }
  }
})

function Id({ lng, lngDict, selfUser, product, couponListResponse, productReviewList, initialFavoriteProduct }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [favoriteProduct, setFavoriteProduct] = useState(initialFavoriteProduct)

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${product.name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={product.name}
        padding={false}
      >
        <SwipeableTileList autoplay>
          {product.images && (product.images.length > 0) ?
            (product.images.map((item, index) => <Tile
                key={item.id}
                image={item.image}
                onClick={() => router.push(`/images/${item.id}/` )}
              />)
          ) : (
            [<Tile image={constants.NO_IMAGE_PATH}/>]
          )}
        </SwipeableTileList>
        <Box padding={1}>
          <Box marginBottom={1}>
            <Typography variant='h5'>{product.name}</Typography>
            <Typography variant='h6'>{product.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</Typography>
          </Box>
          <Divider />
          <Box marginTop={1}>
            <Typography variant='body1'>{product.description}</Typography>
          </Box>
          <Box marginTop={1}>
            <Typography variant='h5'>{i18n.t('stock')}: {couponListResponse.data.count}</Typography>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push(`/stores/${product.store.id}/`)}
            >
              {i18n.t('goToStore')}
            </Button>
          </Box>
          {(selfUser.id !== product.store.user) && (
            <>
              {couponListResponse.data.count > 0 && (
                <>
                  <Box marginY={1}>
                    <Button
                      color='default'
                      fullWidth
                      variant='contained'
                      onClick={() => router.push({
                        pathname: '/coupons/buy/',
                        query: { coupon: couponListResponse.data.results[0].id },
                      })}
                    >
                      {i18n.t('purchaseCoupons')}
                    </Button>
                  </Box>
                  <Box marginY={1}>
                    <Button
                      color='default'
                      fullWidth
                      variant='contained'
                      onClick={() => router.push({
                        pathname: '/coupons/give/',
                        query: { coupon: couponListResponse.data.results[0].id },
                      })}
                    >
                      {i18n.t('giveCoupons')}
                    </Button>
                  </Box>
                </>
              )}
              {!favoriteProduct && (
                <Box marginY={1}>
                  <Button
                    color='primary'
                    fullWidth
                    variant='contained'
                    onClick={async () => {
                      const postFavoriteProductResult = await postFavoriteProduct(product);
                      if (postFavoriteProductResult.status === 201) setFavoriteProduct(postFavoriteProductResult.data);
                      else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                    }}
                  >
                    {i18n.t('addFavoriteProduct')}
                  </Button>
                </Box>
              )}
              {favoriteProduct && (
                <Box marginY={1}>
                  <Button
                    className={classes.errorButton}
                    fullWidth
                    variant='contained'
                    onClick={async () => {
                      const deleteFavoriteProductResult = await deleteFavoriteProduct(favoriteProduct);
                      if (deleteFavoriteProductResult.status === 204) setFavoriteProduct(null);
                      else toast.error(i18n.t('_errorOccurredProcessingRequest'));
                    }}
                  >
                    {i18n.t('deleteFavoriteProduct')}
                  </Button>
                </Box>
              )}
            </>
          )}
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
          productReviewList.slice(0, constants.LIST_SLICE_NUMBER).map((item, index) => (
            <>
              <ListItem
                variant='review'
                title={item.review.article.title}
                date={new Date(item.review.article.created_at)}
                score={item.review.score}
                onClick={() => router.push(`/product-reviews/${item.id}/`)}
              />
              {index < productReviewList.slice(0, constants.LIST_SLICE_NUMBER).length - 1 && (<Divider />)}
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
              pathname: '/product-reviews/create/',
              query: { product: product.id },
            })}
          >
            {i18n.t('addReview')}
          </Button>
        </Box>
      </Section>


      {(selfUser.id === product.store.user) && (
        <Section
          title={i18n.t('managements')}
          titlePrefix={<IconButton><SettingsIcon /></IconButton>}
        >
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
        </Section>
      )}


    </Layout>
  );
}

export default Id;
