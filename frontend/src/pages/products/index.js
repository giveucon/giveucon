import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStore = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${context.query.store}/`, {
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

const getProductList = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    if (context.query.store) { params.store = context.query.store };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/`, {
        params,
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
  const productListResponse = await getProductList(session, context)
  const storeResponse = await getStore(session, context)
  return {
    props: { session, selfUser, productList: productListResponse.data, store: storeResponse.data },
  }
})

function Index({ session, selfUser, storeList, store }) {
  const router = useRouter();
  return (
    <Layout title={`상품 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 목록'
      >
        <Grid container>
          {storeList && storeList.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Tile
                title={item.name}
                subtitle={item.price.toLocaleString('ko-KR') + '원'}
                image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                actions={[
                  <IconButton><FavoriteIcon /></IconButton>
                ]}
                onClick={() => router.push(`/stores/${item.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Section>
      { store && (selfUser.id === store.user) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
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
