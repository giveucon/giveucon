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
import withAuth from '../../utils/withAuth'

function Charge({ selfUser }) {

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  const getProduct = async () => {
    return await requestToBackend(`api/products/${router.query.id}`, 'get', 'json', null, null);
  };

  const getStore = async (product) => {
    return await requestToBackend(`api/stores/${product.store}`, 'get', 'json', null, null);
  };

  const postCoupon = async (selfUser, product) => {
    const data = {
      used: false,
      user: selfUser.id,
      product: product.id,
    };
    return await requestToBackend(`api/coupons/`, 'post', 'json', data, null);
  };

  useEffect(() => {
    const fetch = async () => {
      const productResponse = await getProduct();
      const storeResponse = await getStore(productResponse.data);
      setProduct(productResponse.data);
      setStore(storeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

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

export default withAuth(Charge);
