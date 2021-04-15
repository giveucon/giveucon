import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getProduct = async (session, context) => {
  return await requestToBackend(session, `api/products/${context.query.id}/`, 'get', 'json');
};

const getStore = async (session, product) => {
  return await requestToBackend(session, `api/stores/${product.store}/`, 'get', 'json');
};

const postCoupon = async (session, selfUser, product) => {
  const data = {
    used: false,
    user: selfUser.id,
    product: product.id,
  };
  return await requestToBackend(session, `api/coupons/`, 'post', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const productResponse = await getProduct(session, context);
  const storeResponse = await getStore(session, productResponse.data);
  return {
    props: { session, selfUser, product: productResponse.data, store: storeResponse.data },
  };
})

function Charge({ session, selfUser, product, store }) {
  const router = useRouter();
  return (
    <Layout title={`${product.name} 구매 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <Box>
          <Typography variant='h5'>{product.name}</Typography>
          <Typography variant='h6'>{product.price.toLocaleString('ko-KR') + '원'}</Typography>
          <Typography variant='body1'>{product.description}</Typography>
        </Box>
      </Section>
      {(selfUser.id !== store.owner) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await postCoupon(session, selfUser, product);
              if (response.status === 200) {
                router.push(`/coupons/${response.data.id}/`);
                toast.success('상품 결재가 완료되었습니다.');
              } else {
                toast.error('상품 결재 중 오류가 발생했습니다.');
              }
            }}
          >
            쿠폰 구매
          </Button>
        </Box>
      )}
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
    </Layout>
  );
}

export default Charge;
