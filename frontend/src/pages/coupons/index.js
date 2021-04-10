import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getProductList = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    if (context.query.store) { params.store = context.query.store };
    if (context.query.product) { params.store = context.query.product };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products`, {
        params,
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
  const couponList = await getProductList(session, context)
  return {
    props: { session, selfUser, couponList },
  }
})

function Index({ session, couponList }) {
  const router = useRouter();
  return (
    <Layout title={`쿠폰 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="쿠폰 목록"
      >
        <Grid container>
          {couponList && couponList.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Tile
                title={item.name}
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={item.user === selfUser.id
                  ? (() => router.push(`/coupons/${item.id}`))
                  : null
                }
                menuItems={<MenuItem>Menu Item</MenuItem>}
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

export default Index;
