import React from 'react';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getCouponList = async (context, selfUser) => {
  const params = {
    user: selfUser.id,
  };
  return await requestToBackend(context, 'api/coupons/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const selfCouponListResponse = await getCouponList(context, selfUser);
  return {
    props: { selfUser, selfCouponList: selfCouponListResponse.data.results },
  };
})

function Index({ selfUser, selfCouponList }) {
  const router = useRouter();
  return (
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
        {(selfCouponList.length > 0) ? (
          <Grid container spacing={1}>
            {selfCouponList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={`쿠폰 이름`}
                  image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                  actions={[
                    <IconButton><DirectionsIcon /></IconButton>,
                    <IconButton><CropFreeIcon /></IconButton>
                  ]}
                  onClick={() => router.push(`/coupons/${item.id}/`)}
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
