import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InsertCommentIcon from '@material-ui/icons/InsertComment';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSellingList = async (context) => {
  return await requestToBackend(context, 'api/coupon-sellings', 'get', 'json');
};

const getSelfCouponSellingList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/coupon-sellings', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingListResponse = await getCouponSellingList(context);
  if (couponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const selfCouponSellingListResponse = await getSelfCouponSellingList(context, selfUser);
  if (selfCouponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSellingList: couponSellingListResponse.data.results,
      selfCouponSellingList: selfCouponSellingListResponse.data.results }
  }
})

function Index({ lng, lngDict, selfUser, couponSellingList, selfCouponSellingList }) {
  
  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('trades')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('trades')}
      >
      </Section>
      

      <Section
        title={i18n.t('myCouponTrades')}
        titlePrefix={<IconButton><InsertCommentIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/coupon-sellings/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {selfCouponSellingList.length > 0 ? (
          <SwipeableTileList half>
            {selfCouponSellingList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => (
              <Tile
                key={index}
                title={item.coupon.product.name}
                image={
                  item.coupon.product.images && (item.coupon.product.images.length > 0)
                  ? item.coupon.product.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/coupon-sellings/${item.id}/`)}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      

      <Section
        title={i18n.t('couponTrades')}
        titlePrefix={<IconButton><InsertCommentIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push('/coupon-sellings/list/')}
            />
          </IconButton>
        }
        padding={false}
      >
        {selfCouponSellingList.length > 0 ? (
          <SwipeableTileList half>
            {selfCouponSellingList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => (
              <Tile
                key={index}
                title={item.coupon.product.name}
                image={
                  item.coupon.product.images && (item.coupon.product.images.length > 0)
                  ? item.coupon.product.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/coupon-sellings/${item.id}/`)}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>

      
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push('/coupon-sellings/search/')}
        >
          {i18n.t('searchCouponTrades')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Index;
