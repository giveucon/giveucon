import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import CouponSellingBox from 'components/CouponSellingBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.id}`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, couponSelling: couponSellingResponse.data }
  }
})

function Id({ lng, lngDict, selfUser, couponSelling }) {

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
      {selfUser.id !== couponSelling.coupon.user && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/products/${couponSelling.coupon.product.id}/`)}
          >
            {i18n.t('purchaseCoupon')}
          </Button>
        </Box>
      )}
      {selfUser.id === couponSelling.coupon.user && (
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
    </Layout>
  );
}

export default Id;
