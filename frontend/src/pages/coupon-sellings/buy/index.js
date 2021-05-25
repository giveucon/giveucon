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

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.coupon_selling}/`, 'get', 'json');

const putCouponSelling = async (couponSelling, status) => await requestToBackend(null, `api/coupon-sellings/${couponSelling.id}/`, 'put', 'json', {
  status: {"status": status}
}, null)

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

function Index({ lng, lngDict, selfUser, couponSelling }) {

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
          name={couponSelling.coupon.product.name}
          price={couponSelling.price}
          image={couponSelling.coupon.product.images.length > 0 ? couponSelling.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
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
            const putCouponSellingResponse = await putCouponSelling(couponSelling, 'pre_pending');
            if (putCouponSellingResponse.status === 200) {
              toast.success(i18n.t('_couponTradeRequested'));
              router.push({
                pathname: '/coupon-sellings/buy/completed/',
                query: { coupon_selling: couponSelling.id },
              });
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

export default Index;
