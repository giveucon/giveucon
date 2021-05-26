import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StoreIcon from '@material-ui/icons/Store';
import { ResponsivePie } from '@nivo/pie'

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getSelfStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

const getSelfProductList = async (context, selfUser) => {
  const params = {
    store__user: selfUser.id
  };
  return await requestToBackend(context, 'api/products/', 'get', 'json', null, params);
};

const getOpenCouponSellingList = async (context, selfUser) => await requestToBackend(context, `api/coupon-sellings/`, 'get', 'json', null, {
  coupon__user__id: selfUser.id,
  status__status: 'open'
});

const getPrePendingCouponSellingList = async (context, selfUser) => await requestToBackend(context, `api/coupon-sellings/`, 'get', 'json', null, {
  coupon__user__id: selfUser.id,
  status__status: 'pre_pending'
});

const getPendingCouponSellingList = async (context, selfUser) => await requestToBackend(context, `api/coupon-sellings/`, 'get', 'json', null, {
  coupon__user__id: selfUser.id,
  status__status: 'pending'
});

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
  const selfProductListResponse = await getSelfProductList(context, selfUser);
  const openCouponSellingResponse = await getOpenCouponSellingList(context, selfUser);
  const prePendingCouponSellingResponse = await getPrePendingCouponSellingList(context, selfUser);
  const pendingCouponSellingResponse = await getPendingCouponSellingList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfStoreList: selfStoreListResponse.data.results,
      selfProductList: selfProductListResponse.data.results,
      openCouponSellingResponse,
      prePendingCouponSellingResponse,
      pendingCouponSellingResponse
    }
  }
})

function Index({
  lng,
  lngDict,
  selfUser,
  selfStoreList,
  selfProductList,
  openCouponSellingResponse,
  prePendingCouponSellingResponse,
  pendingCouponSellingResponse
}) {

  const i18n = useI18n();
  const router = useRouter();

  const activeCouponSellingData = [];
  if (openCouponSellingResponse.data.count > 0) activeCouponSellingData.push(
    {
      id: i18n.t('onSale'),
      label: i18n.t('onSale'),
      value: openCouponSellingResponse.data.count
    }
  );
  if (prePendingCouponSellingResponse.data.count > 0) activeCouponSellingData.push(
    {
      id: i18n.t('tradeRequested'),
      label: i18n.t('tradeRequested'),
      value: prePendingCouponSellingResponse.data.count
    }
  );
  if (pendingCouponSellingResponse.data.count > 0) activeCouponSellingData.push(
    {
      id: i18n.t('remitted'),
      label: i18n.t('remitted'),
      value: pendingCouponSellingResponse.data.count
    }
  );

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myBusiness')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myBusiness')}
       />

      <Section
        title={i18n.t('summary')}
        titlePrefix={<IconButton><AssessmentIcon /></IconButton>}
      >
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <Box style={{height: '10rem', width: '50%'}}>
            <ResponsivePie
              data={activeCouponSellingData}
              margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
              arcLabel={(e) => `${e.id  } (${  e.value  })`}
              colors={{ scheme: 'accent' }}
              enableArcLinkLabels={false}
              innerRadius={0.5}
              isInteractive={false}
            />
          </Box>
          <Box>
            <Typography variant='h6'>{`${i18n.t('onSale')}: ${openCouponSellingResponse.data.count}`}</Typography>
            <Typography variant='h6'>{`${i18n.t('tradeRequested')}: ${prePendingCouponSellingResponse.data.count}`}</Typography>
            <Typography variant='h6'>{`${i18n.t('remitted')}: ${pendingCouponSellingResponse.data.count}`}</Typography>
          </Box>
        </Box>
      </Section>


      <Section
        title={i18n.t('myStores')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/stores/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {(selfStoreList.length > 0) ? (
          <SwipeableTileList half>
            {selfStoreList.map((item) => (
                <Tile
                  key={item.id}
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/stores/${item.id}/`)}
                />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('myProducts')}
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/products/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {(selfProductList.length > 0) ? (
          <SwipeableTileList half>
            {selfProductList.map((item) => (
                <Tile
                  key={item.id}
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/products/${item.id}/`)}
                />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push('/coupons/scan/')}
        >
          {i18n.t('scanCoupon')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Index;
