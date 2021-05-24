import React from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import Layout from 'components/Layout'
import CouponBox from 'components/CouponBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json');
const putCouponBuy = async (coupon) => await requestToBackend(null, `api/coupons/${coupon.id}/buy/`, 'put', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (couponResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data
    }
  }
})

function Buy({ lng, lngDict, selfUser, coupon }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('purchaseCoupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('purchaseCoupons')}
       />
      <Section
        title={i18n.t('paymentInfo')}
        titlePrefix={<IconButton><PaymentIcon /></IconButton>}
      >
        <CouponBox
          name={coupon.product.name}
          price={coupon.product.price}
          image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          lng={lng}
          lngDict={lngDict}
        />
      </Section>

      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const putCouponBuyResponse = await putCouponBuy(coupon);
            if (putCouponBuyResponse.status === 201) {
              router.push(`/coupons/${putCouponBuyResponse.data.id}/`);
              toast.success(i18n.t('_couponSuccessfullyPurchased'));
            }
            else {
              toast.error(i18n.t('_errorOccurredProcessingRequest'));
            }
          }}
        >
          {i18n.t('purchaseCoupon')}
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.back()}
        >
          {i18n.t('goBack')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Buy;
