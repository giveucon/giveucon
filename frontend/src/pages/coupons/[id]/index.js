import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Layout from '../../../components/Layout'
import BusinessCard from '../../../components/BusinessCard';
import Section from '../../../components/Section'
import withAuthServerSideProps from '../../withAuthServerSideProps'

const getCoupon = async (session, id) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/coupons/" + id, {
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
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/products/" + coupon.product, {
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
    props: { session, coupon, product },
  }
})

function Index({ session, coupon, product }) {
  const router = useRouter();
  return (
    <Layout title={"쿠폰 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title={product.name}
      >
      </Section>
      <Section
        title={product.name}
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
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
    </Layout>
  );
}

export default Index;
