import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from '../../components/Layout'
import BusinessCard from '../../components/BusinessCard';
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCoupon = async (session, id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/${id}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getProduct = async (session, coupon) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${coupon.product}`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const coupon = await getCoupon(session, context.query.id)
  const product = await getProduct(session, coupon)
  return {
    props: { session, selfUser, coupon, product },
  }
})

function Use({ session, selfUser, coupon, product }) {
  const router = useRouter();
  return (
    <Layout title={`쿠폰 사용 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={`쿠폰 사용`}
      >
      </Section>
      <Section
        title={product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <BusinessCard
          title={product.description}
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
          menuItems={
            <MenuItem>Menu Item</MenuItem>
          }
        />
      </Section>
      <Box marginY={1}>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
    </Layout>
  );
}

export default Use;
