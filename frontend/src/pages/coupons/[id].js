import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import Layout from 'components/Layout'
import Tile from 'components/Tile';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/coupons/${context.query.id}`, 'get', 'json');
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
  return {
    props: { lng, lngDict, selfUser, coupon: couponResponse.data },
  };
})

function Id({ lng, lngDict, selfUser, coupon }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('coupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('coupons')}
      >
      </Section>
      <Section
        title={coupon.product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <Tile
          title={coupon.product.description}
          image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
        />
      </Section>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/products/${coupon.product.id}/`)}
        >
          {i18n.t('goToProduct')}
        </Button>
      </Box>
      {selfUser.id === coupon.user && (
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
