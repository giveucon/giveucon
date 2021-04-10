import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ArticleBox from '../../../components/ArticleBox';
import BusinessCard from '../../../components/BusinessCard';
import Layout from '../../../components/Layout'
import Tile from '../../../components/Tile';
import Section from '../../../components/Section'
import withAuthServerSideProps from '../../withAuthServerSideProps'

const useStyles = makeStyles({
  RedButton: {
    background: '#f44336',
    color: 'white',
  },
});

const getProduct = async (session, id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/${id}`, {
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

const getStore = async (session, id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${id}`, {
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
  const product = await getProduct(session, context.query.id)
  const store = await getStore(session, product.store)
  return {
    props: { session, selfUser, product, store },
  }
})

function Index({ session, selfUser, product, store }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`${product.name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
      >
        <ArticleBox
          title="상품 설명"
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          content={product.description}
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
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
          <Box marginY={1}>
            <Button
              className={classes.RedButton}
              fullWidth
              variant="contained"
              onClick={() => router.push({
                  pathname: '/products/delete',
                  query: { id: product.id },
              })}
            >
              상품 삭제
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default Index;
