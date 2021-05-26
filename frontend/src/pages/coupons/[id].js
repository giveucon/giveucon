import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import CouponBox from 'components/CouponBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
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

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.id}`, 'get', 'json');

const getCouponSellingList = async (context) => await requestToBackend(context, 'api/coupons/', 'get', 'json', null, {
  coupon__id: context.query.id
});

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (couponResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const couponSellingListResponse = await getCouponSellingList(context);
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user.id)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data,
      couponSelling: couponSellingListResponse.data.count === 1 ? couponSellingListResponse.data.results[0] : null
    }
  }
})

function Id({ lng, lngDict, selfUser, coupon, couponSelling }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('coupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('coupons')}
       />
      <Section
        title={coupon.product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <CouponBox
          lng={lng}
          lngDict={lngDict}
          name={coupon.product.name}
          image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          price={coupon.product.price}
        />
      </Section>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/products/${coupon.product.id}/`)}
        >
          {i18n.t('goToProduct')}
        </Button>
      </Box>
      {(selfUser.id === coupon.user.id) && !couponSelling && (
        <>
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/coupons/use/',
                query: { id: coupon.id },
              })}
            >
              {i18n.t('useCoupon')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/coupons/give/',
                query: { coupon: coupon.id },
              })}
            >
              {i18n.t('giveCoupon')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/coupon-sellings/create/',
                query: { coupon: coupon.id },
              })}
            >
              {i18n.t('addCouponTrade')}
            </Button>
          </Box>
        </>
      )}
      {(selfUser.id === coupon.user.id) && couponSelling && (
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/delete/',
              query: { coupon_selling: couponSelling.id },
            })}
          >
            {i18n.t('deleteCouponTrade')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
