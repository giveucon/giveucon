import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import CouponSellingBox from 'components/CouponSellingBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.id}`, 'get', 'json', null, {
  used: false
})

const getBuyer = async (context, couponSelling) => await requestToBackend(context, `api/users/${couponSelling.buyer.id}`, 'get', 'json', null)

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const buyerResponse = couponSellingResponse.data.buyer ? await getBuyer(context, couponSellingResponse.data) : null;
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSelling: couponSellingResponse.data,
      buyer: couponSellingResponse.data.buyer ? buyerResponse.data : null
    }
  }
})

function Id({ lng, lngDict, selfUser, couponSelling, buyer }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('couponTrades')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('couponTrades')}
       />
      <Section
        title={couponSelling.coupon.product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <CouponSellingBox
          lng={lng}
          lngDict={lngDict}
          name={couponSelling.coupon.product.name}
          image={couponSelling.coupon.product.images.length > 0 ? couponSelling.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          price={couponSelling.price}
          productPrice={couponSelling.coupon.product.price}
        />
      </Section>
      

      {(couponSelling.status === 'pre_pending') && (selfUser.id === couponSelling.buyer) && (
        <Section
          title={i18n.t('cryptocurrencyWalletAddress')}
          titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        >
          <Typography variant='h6'>{i18n.t('_sendCryptocurrencyToWallet')}</Typography>
          <Typography variant='h6'>{`${i18n.t('bitcoin')}, ${buyer.wallet}`}</Typography>
          <Typography variant='h6'>{`${couponSelling.price / 100000000}${i18n.t('_currencyBTC')}`}</Typography>
        </Section>
      )}


      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/products/${couponSelling.coupon.product.id}/`)}
        >
          {i18n.t('goToProduct')}
        </Button>
      </Box>

      {(couponSelling.status === 'open') && (selfUser.id !== couponSelling.coupon.user.id) && (
        <>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/coupons/buy/',
                query: { coupon: couponSelling.coupon.id },
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
                query: { coupon: couponSelling.coupon.id },
              })}
            >
              {i18n.t('giveCoupons')}
            </Button>
          </Box>
        </>
      )}
      {(couponSelling.status === 'open') && (selfUser.id === couponSelling.coupon.user.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/update/',
              query: { id: couponSelling.id },
            })}
          >
            {i18n.t('editCouponTrade')}
          </Button>
        </Box>
      )}
      {(couponSelling.status === 'pre_pending') && (selfUser.id === couponSelling.buyer) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const putCouponSellingResponse = await putCouponSelling(couponSelling, 'pending');
              if (putCouponSellingResponse.status === 200) {
                toast.success(i18n.t('_couponTradeConfirmationRequested'));
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('editCouponTrade')}
          </Button>
        </Box>
      )}
      {(couponSelling.status === 'pending') && (selfUser.id === couponSelling.coupon.user.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const putCouponSellingResponse = await putCouponSelling(couponSelling, 'closed');
              if (putCouponSellingResponse.status === 200) {
                toast.success(i18n.t('_couponTradeConfirmed'));
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('editCouponTrade')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
