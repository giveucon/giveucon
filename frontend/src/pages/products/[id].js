import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Tile from '../../components/Tile';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Id({ selfUser }) {

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  const getProduct = async () => {
    return await requestToBackend(`api/products/${router.query.id}`, 'get', 'json', null, null);
  };

  const getStore = async (product) => {
    return await requestToBackend(`api/stores/${product.store}`, 'get', 'json', null, null);
  };

  useEffect(() => {
    const fetch = async () => {
      const productResponse = await getProduct();
      const storeResponse = await getStore(productResponse.data);
      setProduct(prevProduct => productResponse.data);
      setStore(prevStore => storeResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`${product ? product.name : '로딩중'} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product ? product.name : '로딩중'}
        padding={false}
      >
        {product && (
          <>
            <SwipeableTileList autoplay={true}>
              {product.images && (product.images.length > 0) ?
                  (product.images.map((item, index) => {
                    return <Tile
                      key={index}
                      image={item.image}
                      onClick={() => router.push(`/images/${item.id}/` )}
                    />
                  })
                ) : (
                  <Tile image='/no_image.png'/>
                )
              }
            </SwipeableTileList>
            <Box padding={1}>
              <Typography variant='h5'>{product.name}</Typography>
              <Typography variant='h6'>{`${(product.price || 0).toLocaleString('ko-KR')}원`}</Typography>
              <Typography variant='body1'>{product.description}</Typography>
            </Box>
          </>
        )}
        {!product && (
          <SwipeableTileList autoplay={true}>
            <Tile skeleton/>
          </SwipeableTileList>
        )}
      </Section>
      {selfUser && store && product && (selfUser.id !== store.owner) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/charge/',
              query: { id: product.id },
            })}
          >
            쿠폰 구매
          </Button>
        </Box>
      )}
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/stores/${store.id}/`,)}
        >
          상점으로 이동
        </Button>
      </Box>
      {selfUser && store && product && (selfUser.id === store.user) && (store.id === product.store) && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/products/update/',
              query: { id: product.id },
            })}
          >
            상품 정보 수정
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default withAuth(Id);
