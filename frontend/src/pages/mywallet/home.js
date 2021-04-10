import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCouponList = async (session, selfUser) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/coupons", {
        params: {
          user: selfUser.id,
        },
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
  const couponList = await getCouponList(session, selfUser)
  return {
    props: { selfUser, couponList },
  }
})

function Home({ selfUser, couponList }) {
  const router = useRouter();
  return (
    <>
      <Layout title={"내 지갑 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
        <Section
          backButton
          title="내 지갑"
        >
        </Section>
        <Section
          title="내 쿠폰"
          titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
          titleSuffix={<><IconButton><ArrowForwardIcon /></IconButton></>}
        >
          <Grid container>
            {couponList && couponList.map((item, key) => (
              <Grid item xs={6}>
                <Tile
                  title={item.name}
                  image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                  onClick={() => 
                    router.push(`/coupons/${item.id}`
                  )}
                  menuItems={
                    <MenuItem>Menu Item</MenuItem>
                  }
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
