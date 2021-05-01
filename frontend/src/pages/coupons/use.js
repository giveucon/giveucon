import React from 'react';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/use-i18n'
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

const getProduct = async (context, coupon) => {
  return await requestToBackend(context, `api/products/${coupon.product}`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  const couponQRResponse = await getCouponQR(context);
  const productResponse = await getProduct(context, couponResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data,
      couponQR: couponQRResponse.data,
      product: productResponse.data
    },
  };
})

function Use({ lng, lngDict, selfUser, coupon, couponQR, product }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout title={`쿠폰 사용 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <Card>
          <Box display='flex' justifyContent='center' style={{positions: 'responsive'}}> 
            <QRCode
              value={JSON.stringify(couponQR)}
              size={400}
              includeMargin={true}
            />
          </Box>
        </Card>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
    </Layout>
  );
}

export default Use;
