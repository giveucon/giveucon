import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MenuItem from '@material-ui/core/MenuItem';

import Layout from 'components/Layout'
import BusinessCard from 'components/BusinessCard';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/coupons/${context.query.id}`, 'get', 'json');
};

const getProduct = async (context, coupon) => {
  return await requestToBackend(context, `api/products/${coupon.product}`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  const productResponse = await getProduct(context, couponResponse.data);
  return {
    props: { lng, lngDict, selfUser, coupon: couponResponse.data, product: productResponse.data },
  };
})

function Id({ lng, lngDict, selfUser, coupon, product }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={selfUser.locale}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('coupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('coupons')}
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
            {i18n.t('useCoupon')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
