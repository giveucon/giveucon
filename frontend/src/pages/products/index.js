import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStore = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${context.query.store}`, {
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

const getProductList = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    if (context.query.store) { params.store = context.query.store };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products`, {
        params,
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
  const productList = await getProductList(session, context)
  const store = context.query.store ? await getStore(session, context) : null
  return {
    props: { session, selfUser, productList, store },
  }
})

function Index({ session, selfUser, storeList, store }) {
  const router = useRouter();
  return (
    <Layout title={`상품 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="상품 목록"
      >
        <Grid container>
          {storeList && storeList.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Tile
                title={item.name}
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => router.push(`/stores/${item.id}`)}
                menuItems={<MenuItem>Menu Item</MenuItem>}
              />
            </Grid>
          ))}
        </Grid>
      </Section>
      { store && (selfUser.id === store.user) && (
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={() => router.push({
              pathname: '/products/create',
              query: { id: store.id },
            })}
          >
            새 상품 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Index;
