import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCoupon = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/${context.query.id}/`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const getCouponQR = async (session, context) => {
  try {
    let params = new Object;
    params.type = `qr`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/${context.query.id}/`, {
        params,
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const getProduct = async (session, coupon) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${coupon.product}`, {
        headers: {
          'Authorization': 'Bearer ' + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const couponResponse = await getCoupon(session, context)
  const couponQRResponse = await getCouponQR(session, context)
  const productResponse = await getProduct(session, couponResponse.data)
  return {
    props: {
      session,
      selfUser,
      coupon: couponResponse.data,
      couponQR: couponQRResponse.data,
      product: productResponse.data },
  }
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
