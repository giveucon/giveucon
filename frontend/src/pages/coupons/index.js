import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCouponList = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    if (context.query.store) { params.store = context.query.store };
    if (context.query.product) { params.store = context.query.product };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons`, {
        params,
        headers: {
          'Authorization': "Bearer " + session.accessToken,
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
  const couponListResponse = await getCouponList(session, context)
  return {
    props: { session, selfUser, couponList: couponListResponse.data },
  }
})

function Index({ session, selfUser, couponList }) {
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
                title={`쿠폰 이름`}
                image="https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg"
                actions={[
                  <IconButton><DirectionsIcon /></IconButton>,
                  <IconButton><CropFreeIcon /></IconButton>
                ]}
                onClick={item.user === selfUser.id
                  ? (() => router.push(`/coupons/${item.id}`))
                  : null
                }
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

export default Index;
