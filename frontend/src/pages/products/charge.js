import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ArticleBox from '../../components/ArticleBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, product) => {
  return await requestToBackend(context, `api/stores/${product.store}/`, 'get', 'json');
};

const postCoupon = async (selfUser, product) => {
  const data = {
    used: false,
    user: selfUser.id,
    product: product.id,
  };
  return await requestToBackend(null, `api/coupons/`, 'post', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const productResponse = await getProduct(context);
  const storeResponse = await getStore(context, productResponse.data);
  return {
    props: { selfUser, product: productResponse.data, store: storeResponse.data },
  };
})

function Charge({ selfUser, product, store }) {
  const router = useRouter();
  return (
    <Layout title={`결재 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product ? '결재 내용' : '로딩중'}
      >
        {product && (
          <Box>
            <Typography variant='h5'>{product.name}</Typography>
            <Typography variant='h6'>{product.price.toLocaleString('ko-KR') + '원'}</Typography>
            <Typography variant='body1'>{product.description}</Typography>
          </Box>
        )}
        {!product && (
          <ArticleBox skeleton/>
        )}
      </Section>
      {product && store && (selfUser.id !== store.owner) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await postCoupon(selfUser, product);
              if (response.status === 200) {
                router.push(`/coupons/${response.data.id}/`);
                toast.success('상품 결재가 완료되었습니다.');
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
