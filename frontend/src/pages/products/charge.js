import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const postCoupon = async (selfUser, product) => {
  const data = {
    used: false,
    user: selfUser.id,
    product: product.id,
  };
  return await requestToBackend(`api/coupons/`, 'post', 'json', data, null);
};

function Charge({ selfUser }) {

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const productResponse = await requestToBackend(`api/products/${router.query.id}`, 'get', 'json', null, null);
      const storeResponse = await requestToBackend(`api/stores/${productResponse.data.store}`, 'get', 'json', null, null);
      setProduct(productResponse.data);
      setStore(storeResponse.data);
    }
    fetch();
  }, []);
  if (!product || !store) return <div>loading...</div>

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
