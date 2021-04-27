import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import AlertBox from '../../components/AlertBox'
import InfiniteScrollLoader from '../../components/InfiniteScrollLoader';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getProductList = async (context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
  };
  return await requestToBackend(context, 'api/products', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const initialProductListResponse = await getProductList(context);
  const userResponse = context.query.user && await getUser(context);
  const storeResponse = context.query.store && await getStore(context);
  return {
    props: {
      selfUser,
      initialProductListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null,
    },
  };
})

function List({ selfUser, initialProductListResponse, user, store }) {

  const router = useRouter();
  const [productList, setProductList] = useState(initialProductListResponse.data.results);
  const [productListPagination, setProductListPagination] = useState(0);
  const [hasMoreProductList, setHasMoreProductList] = useState(initialProductListResponse.data.next);

  const getMoreProductList = async () => {
    const productListResponse = await await requestToBackend('api/products/', 'get', 'json', null, {
      user: user.id || null,
      store: store.id || null,
      page: productListPagination + 1,
    });
    setProductList(prevProductList => (prevProductList || []).concat(productListResponse.data.results));
    setProductListPagination(prevProductListPagination => prevProductListPagination + 1);
    if (productListPagination.data.next === null) setHasMoreProductList(prevHasMoreProductList => false);
  }

  return (
    <Layout title={`상품 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='상품 목록'
      >
        {productList && (
          (productList.length > 0) ? (
            <InfiniteScroll
              dataLength={productList.length}
              next={getMoreProductList}
              hasMore={hasMoreProductList}
              loader={<InfiniteScrollLoader loading={true} />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              <Grid container spacing={1}>
                {productList && productList.map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Tile
                      title={item.name}
                      subtitle={item.price.toLocaleString('ko-KR') + '원'}
                      image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                      actions={[
                        <IconButton><FavoriteIcon /></IconButton>
                      ]}
                      onClick={() => router.push(`/products/${item.id}/`)}
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          ) : (
            <AlertBox content='상품이 없습니다.' variant='information' />
          )
        )}
        {!productList && (
          <Grid container spacing={1}>
            {Array.from(Array(4).keys()).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile skeleton/>
              </Grid>
            ))}
          </Grid>
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

export default List;
