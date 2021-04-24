import React, { useEffect, useState } from 'react';
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
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function List({ selfUser }) {

  const router = useRouter();
  const [productList, setProductList] = useState(null);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const productListResponse = await requestToBackend('api/products/', 'get', 'json', null, {
        user: router.query.user || null,
        store: router.query.store || null,
      });
      const userResponse = await requestToBackend(`api/users/${router.query.user}`, 'get', 'json', null, null);
      const storeResponse = await requestToBackend(`api/stores/${router.query.store}`, 'get', 'json', null, null);
      setProductList(productListResponse.data);
      setUser(userResponse.data);
      setStore(storeResponse.data);
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
          productList && (productList.length > 0) ? (
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
