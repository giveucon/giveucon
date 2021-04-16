import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
    '&:hover': {
       background: '#aa2e25',
    },
  },
});

const getCoupon = async (session, context) => {
  return await requestToBackend(session, `api/products/${context.query.id}`, 'get', 'json');
};

const deleteCoupon = async (session, coupon) => {
  return await requestToBackend(session, `api/coupons/${coupon.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps('user', async (context, session, selfUser) => {
  const couponResponse = await getCoupon(session, context);
  return {
    props: { session, selfUser, coupon: couponResponse.data },
  };
})

function Delete({ session, selfUser, coupon }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`쿠폰 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteCoupon(session, coupon);
              if (response.status === 204) {
                router.push(`/coupons/`);
                toast.success('쿠폰이 삭제되었습니다.');
              }
            }}
          >
            가게 삭제
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
