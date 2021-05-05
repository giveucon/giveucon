import React from 'react';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/coupons/${context.query.id}/`, 'get', 'json');
};

const getCouponQR = async (context) => {
  let params = new Object;
  params.type = `qr`;
  return await requestToBackend(context, `api/coupons/${context.query.id}/`, 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, darkMode, selfUser) => {
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
  const couponQRResponse = await getCouponQR(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data,
      couponQR: couponQRResponse.data,
    }
  }
})

function Use({ lng, lngDict, darkMode, selfUser, coupon, couponQR }) {

  const i18n = useI18n();
  const router = useRouter();

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
            value={JSON.stringify(couponQR)}
            size={400}
            includeMargin={true}
          />
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
