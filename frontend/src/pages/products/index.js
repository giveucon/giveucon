import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStore = async (session, context) => {
  return await requestToBackend(session, `api/stores/${context.query.store}/`, 'get', 'json');
};

const getProductList = async (session, context) => {
  const params = {
    user = context.query.user || null,
    store = context.query.store || null,
  };
  return await requestToBackend(session, 'api/products', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const productListResponse = await getProductList(session, context);
  const storeResponse = await getStore(session, context);
  return {
    props: { session, selfUser, productList: productListResponse.data, store: storeResponse.data },
  };
})

function Index({ session, selfUser, productList, store }) {
  const router = useRouter();
  return (
    <Layout title={`상품 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 목록'
      >
        {productList && (productList.length > 0) ? (
          <Grid container spacing={1}>
            {productList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  subtitle={item.price.toLocaleString('ko-KR') + '원'}
                  image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                  actions={[
                    <IconButton><FavoriteIcon /></IconButton>
                  ]}
                  onClick={() => router.push(`/products/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content='상품이 없습니다.' variant='information' />
        )}
      </Section>
      { store && (selfUser.id === store.user) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/create/',
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
