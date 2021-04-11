import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ProductBox from '../../components/ProductBox';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getProduct = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${context.query.id}`, {
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

const getStore = async (session, product) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${product.id}`, {
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
  const product = await getProduct(session, context)
  const store = await getStore(session, product)
  return {
    props: { session, selfUser, product, store },
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
        <ProductBox
          name={product.name}
          price={product.price}
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          content={product.description}
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
      { (selfUser.id !== store.owner) && (store.id === product.store) && (
        <>
          <Box marginY={1}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
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
          color="default"
          fullWidth
          variant="contained"
          onClick={() => router.push(`/stores/${store.id}`,)}
        >
          상점으로 이동
        </Button>
      </Box>
      { (selfUser.id === store.owner) && (store.id === product.store) && (
        <>
          <Box marginY={1}>
            <Button
              color="default"
              fullWidth
              variant="contained"
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
