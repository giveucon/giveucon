import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.coupon_selling}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSelling: couponSellingResponse.data
    }
  }
})

function Completed({ lng, lngDict, selfUser, couponSelling }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('purchaseCanceled')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('purchaseCanceled')}
      >
        <AlertBox content={i18n.t('_couponTradePurchaseCanceled')} variant='success' />
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            {i18n.t('goBack')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.push(`/coupon-sellings/${couponSelling.id}/`)}}
          >
            {i18n.t('goToCouponSelling')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.push(`/products/${couponSelling.coupon.product.id}/`)}}
          >
            {i18n.t('goToProduct')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/')}
          >
            {i18n.t('goHome')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Completed;
