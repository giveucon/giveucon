import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCouponList = async (session, selfUser) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/`, {
        params: {
          user: selfUser.id,
        },
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

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const couponListResponse = await getCouponList(session, selfUser)
  return {
    props: { session, selfUser, couponList: couponListResponse.data },
  }
})

function Home({ session, selfUser, couponList }) {
  const router = useRouter();
  return (
    <>
    <Layout title={`내 지갑 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
        <Section
          backButton
          title='내 지갑'
        >
        </Section>
        <Section
          title='내 쿠폰'
          titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
          titleSuffix={<IconButton><ArrowForwardIcon /></IconButton>}
        >
          <Grid container>
            {couponList && couponList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={`쿠폰 이름`}
                  image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                  actions={[
                    <IconButton><DirectionsIcon /></IconButton>,
                    <IconButton><CropFreeIcon /></IconButton>
                  ]}
                  onClick={() => router.push(`/coupons/${item.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        </Section>
      </Layout>
    </>
  );
}

export default Home;
