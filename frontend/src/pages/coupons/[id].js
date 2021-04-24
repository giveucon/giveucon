import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from '../../components/Layout'
import BusinessCard from '../../components/BusinessCard';
import Section from '../../components/Section'
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Id({ selfUser }) {

  const router = useRouter();
  const [coupon, setCoupon] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const couponResponse = await requestToBackend(`api/stores/${router.query.id}`, 'get', 'json', null, null);
      const productResponse = await requestToBackend(`api/products/${couponResponse.data.id}`, 'get', 'json', null, null);
      setCoupon(couponResponse.data);
      setProduct(productResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);
  if (!coupon || !product) return <div>loading...</div>

  return (
    <Layout title={`쿠폰 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={`쿠폰`}
      >
      </Section>
      <Section
        title={product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <BusinessCard
          title={product.description}
          image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
          onClick={() => alert( 'Tapped' )}
          menuItems={
            <MenuItem>Menu Item</MenuItem>
          }
        />
      </Section>
      { selfUser.id === coupon.user && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupons/use/',
              query: { id: coupon.id },
            })}
          >
            쿠폰 사용
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default withAuth(Id);
