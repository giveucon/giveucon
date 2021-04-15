import React from 'react';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCouponList = async (session, context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
    product: context.query.product || null,
  };
  return await requestToBackend(session, 'api/coupons/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const couponListResponse = await getCouponList(session, context)
  return {
    props: { session, selfUser, couponList: couponListResponse.data },
  };
})

function Index({ session, selfUser, couponList }) {
  const router = useRouter();
  return (
    <Layout title={`쿠폰 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 목록'
      >
        {couponList && (couponList.length > 0) ? (
          <Grid container>
            {couponList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={`쿠폰 이름`}
                  image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                  actions={[
                    <IconButton><DirectionsIcon /></IconButton>,
                    <IconButton><CropFreeIcon /></IconButton>
                  ]}
                  onClick={item.user === selfUser.id
                    ? (() => router.push(`/coupons/${item.id}/`))
                    : null
                  }
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content='쿠폰이 없습니다.' variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Index;
