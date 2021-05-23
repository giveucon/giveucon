import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StoreIcon from '@material-ui/icons/Store';

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

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
  const selfProductListResponse = await getSelfProductList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfStoreList: selfStoreListResponse.data.results,
      selfProductList: selfProductListResponse.data.results,
    }
  }
})

function Index({ lng, lngDict, selfUser, selfCouponList, selfStoreList, selfProductList }) {

  const i18n = useI18n();
  const router = useRouter();

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
            {selfStoreList.map((item, index) => (
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
            {selfProductList.map((item, index) => (
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
