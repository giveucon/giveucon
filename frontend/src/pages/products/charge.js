import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ArticleBox from '../../components/ArticleBox';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getProduct = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${context.query.id}/`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
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
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${product.store}/`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
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

const postCoupon = async (session, selfUser, product) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/coupons/`, {
        used: false,
        user: selfUser.id,
        product: product.id,
      }, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
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

function Charge({ session, selfUser, product, store }) {
  const router = useRouter();
  return (
    <Layout title={`${product.name} 구매 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <ArticleBox
          title="쿠폰 구매"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          content={product.description}
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
      { (selfUser.id !== store.owner) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={async () => {
              const response = await postCoupon(session, selfUser, product);
              if (response.status === 200) {
                router.push(`/coupons/${response.data.id}`);
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
          color="default"
          fullWidth
          variant="contained"
          onClick={() => router.back()}
        >
          뒤로가기
        </Button>
      </Box>
    </Layout>
  );
}

export default Charge;
