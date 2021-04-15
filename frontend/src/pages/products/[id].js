import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import BusinessCard from '../../components/BusinessCard';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getProduct = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${context.query.id}/`, {
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

const getStore = async (session, product) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${product.id}/`, {
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
  const productResponse = await getProduct(session, context)
  const storeResponse = await getStore(session, productResponse.data)
  return {
    props: { session, selfUser, product: productResponse.data, store: storeResponse.data },
  }
})

function Id({ session, selfUser, product, store }) {
  const router = useRouter();
  return (
    <Layout title={`${product.name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <Box display={true ? 'block' : 'none'}>
          <BusinessCard
            image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
          />
        </Box>
        <Box paddingTop={1}>
          <Typography variant='h5'>{product.name}</Typography>
          <Typography variant='h6'>{product.price.toLocaleString('ko-KR') + '원'}</Typography>
          <Typography variant='body1'>{product.description}</Typography>
        </Box>
      </Section>
      { (selfUser.id !== store.owner) && (store.id === product.store) && (
        <>
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/products/charge',
                query: { id: product.id },
              })}
            >
              쿠폰 구매
            </Button>
          </Box>
        </>
      )}
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/stores/${store.id}`,)}
        >
          상점으로 이동
        </Button>
      </Box>
      { (selfUser.id === store.owner) && (store.id === product.store) && (
        <>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/products/update',
                query: { id: product.id },
              })}
            >
              상품 정보 수정
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default Id;
