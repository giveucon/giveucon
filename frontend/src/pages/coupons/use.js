import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as constants from 'constants';
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/coupons/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (couponResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user)){
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
      coupon: couponResponse.data
    }
  }
})

function Use({ lng, lngDict, selfUser, coupon }) {
// process.env.NEXT_PUBLIC_COUPON_OTP_INTERVAL
  const i18n = useI18n();
  const router = useRouter();
  const [timestamp, setTimestamp] = useState(new Date().getTime() % constants.COUPON_OTP_REFRESH_INTERVAL);
  const [couponQr, setCouponQr] = useState(null);

  useEffect(() => {
    const getCouponQR = async (coupon) => {
      const newCouponQr = await requestToBackend(null, `api/coupons/${coupon.id}/qr/`, 'get', 'json');
      setCouponQr(newCouponQr);
    };
    getCouponQR(coupon);
  }, [])

  useEffect(() => {
    const getCouponQR = async (coupon) => {
      const newCouponQr = await requestToBackend(null, `api/coupons/${coupon.id}/qr/`, 'get', 'json');
      setCouponQr(newCouponQr);
    };
    const timestampId = setTimeout(() => {
      const newTimestamp = new Date().getTime() % constants.COUPON_OTP_REFRESH_INTERVAL;
      if (timestamp > newTimestamp) {
        getCouponQR(coupon);
      }
      setTimestamp(new Date().getTime() % constants.COUPON_OTP_REFRESH_INTERVAL);
    }, constants.COUPON_TIMESTAMP_REFRESH_INTERVAL);
    return () => clearTimeout(timestampId);
  })

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('useCoupon')}- ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={coupon.product.name}
      >
        <Box display='flex' justifyContent='center' style={{positions: 'responsive'}}> 
          <QRCode
            value={JSON.stringify(couponQr)}
            size={400}
            includeMargin={true}
          />
        </Box>
        <Box marginBottom='1rem'>
          <Typography align='center' variant='subtitle1'>
            {`${i18n.t('_QrCodeWillBeRefreshedIn')}${Math.floor((constants.COUPON_OTP_REFRESH_INTERVAL - timestamp) / 1000)}${i18n.t('_localeDateTimeSecond')}`}
          </Typography>
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
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

export default Use;
