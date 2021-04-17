import React from 'react';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCoupon = async (session, context) => {
  return await requestToBackend(session, `api/coupons/${context.query.id}/`, 'get', 'json');
};

const getCouponQR = async (session, context) => {
  let params = new Object;
  params.type = `qr`;
  return await requestToBackend(session, `api/coupons/${context.query.id}/`, 'get', 'json', null, params);
};

const getProduct = async (session, coupon) => {
  return await requestToBackend(session, `api/products/${coupon.product}`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const couponResponse = await getCoupon(session, context);
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  const couponQRResponse = await getCouponQR(session, context);
  const productResponse = await getProduct(session, couponResponse.data);
  return {
    props: {
      session,
      selfUser,
      coupon: couponResponse.data,
      couponQR: couponQRResponse.data,
      product: productResponse.data
    },
  };
})

function Use({ session, selfUser, coupon, couponQR, product }) {
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
