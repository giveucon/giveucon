import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import BusinessCard from '../../components/BusinessCard';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import SwipeableBusinessCardList from '../../components/SwipeableBusinessCardList';
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Id({ selfUser }) {

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const productResponse = await requestToBackend(`api/products/${router.query.id}`, 'get', 'json', null, null);
      const storeResponse = await requestToBackend(`api/stores/${productResponse.data.store}`, 'get', 'json', null, null);
      setProduct(productResponse.data);
      setStore(storeResponse.data);
    }
    fetch();
  }, []);
  if (!product || !store) return <div>loading...</div>

  return (
    <Layout title={`${product.name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={product.name}
        padding={false}
      >
        <SwipeableBusinessCardList autoplay={true}>
          {product.images && (product.images.length > 0) ?
              (product.images.map((item, index) => {
                return <BusinessCard
                  key={index}
                  image={item.image}
                  onClick={() => router.push(`/images/${item.id}/` )}
                />
              })
            ) : (
              <BusinessCard
                image='/no_image.png'
              />
            )
          }
        </SwipeableBusinessCardList>
        <Box padding={1}>
          <Typography variant='h5'>{product.name}</Typography>
          <Typography variant='h6'>{product.price.toLocaleString('ko-KR') + '원'}</Typography>
          <Typography variant='body1'>{product.description}</Typography>
        </Box>
      </Section>
      { (selfUser.id !== store.owner) && (store.id === product.store) && (
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
      { (selfUser.id === store.user) && (store.id === product.store) && (
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
