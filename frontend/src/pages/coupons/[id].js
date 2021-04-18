import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from '../../components/Layout'
import BusinessCard from '../../components/BusinessCard';
import Section from '../../components/Section'
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const getCoupon = async (session, context) => {
  return await requestToBackend(session, `api/coupons/${context.query.id}`, 'get', 'json');
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
  const productResponse = await getProduct(session, couponResponse.data);
  return {
    props: { session, selfUser, coupon: couponResponse.data, product: productResponse.data },
  };
})

function Id({ session, selfUser, coupon, product }) {
  const router = useRouter();
  return (
    <Layout title={`쿠폰 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={`쿠폰`}
      >
      </Section>
      <Section
        title={product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <BusinessCard
          title={product.description}
          image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
          onClick={() => alert( 'Tapped' )}
          menuItems={
            <MenuItem>Menu Item</MenuItem>
          }
        />
      </Section>
      { selfUser.id === coupon.user && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupons/use/',
              query: { id: coupon.id },
            })}
          >
            쿠폰 사용
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
