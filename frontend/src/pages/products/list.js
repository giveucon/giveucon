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
import withAuth from '../../utils/withAuth'

function List({ selfUser }) {

  const router = useRouter();
  const [productList, setProductList] = useState(null);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [productListPagination, setProductListPagination] = useState(0);
  const [hasMoreProductList, setHasMoreProductList] = useState(true);

  const getProductList = async (user, store, page) => {
    return await requestToBackend('api/products/', 'get', 'json', null, {
      user,
      store,
      page,
    });
  };
  
  const getUser = async (user) => {
    return await requestToBackend(`api/users/${user}`, 'get', 'json', null, null);
  };

  const getStore = async (store) => {
    return await requestToBackend(`api/stores/${store}`, 'get', 'json', null, null);
  };

  const getMoreProductList = async () => {
    const productListResponse = await getProductList(
      router.query.user,
      router.query.store,
      productListPagination + 1
    );
    setProductList(prevProductList => (prevProductList || []).concat(productListResponse.data.results));
    setProductListPagination(prevProductListPagination => prevProductListPagination + 1);
    if (productListPagination.data.next === null) setHasMoreProductList(prevHasMoreProductList => false);
  }

  useEffect(() => {
    const fetch = async () => {
      await getMoreProductList();
      if (router.query.user) {
        const userResponse = await getUser(router.query.user);
        setUser(userResponse.data);
      }
      if (router.query.store) {
        const storeResponse = await getStore(router.query.store);
        setStore(storeResponse.data);
      }
    }
    selfUser && fetch();
  }, [selfUser]);

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

export default withAuth(List);
