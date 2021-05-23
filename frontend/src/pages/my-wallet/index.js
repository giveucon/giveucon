import React from 'react';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StoreIcon from '@material-ui/icons/Store';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList'
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getSelfCouponList = async (context, selfUser) => await requestToBackend(context, 'api/coupons/', 'get', 'json', null, {
  user: selfUser.id,
  used: false
});

const getSelfFavoriteStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/favorite-stores/', 'get', 'json', null, params);
};

const getSelfFavoriteProductList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/favorite-products/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfCouponListResponse = await getSelfCouponList(context, selfUser);
  const selfFavoriteStoreListResponse = await getSelfFavoriteStoreList(context, selfUser);
  const selfFavoriteProductListResponse = await getSelfFavoriteProductList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfCouponList: selfCouponListResponse.data.results,
      selfFavoriteStoreList: selfFavoriteStoreListResponse.data.results,
      selfFavoriteProductList: selfFavoriteProductListResponse.data.results
    }
  }
})

function Index({ lng, lngDict, selfUser, selfCouponList, selfFavoriteStoreList, selfFavoriteProductList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myWallet')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myWallet')}
       />


      <Section
        title={i18n.t('myCoupons')}
        titlePrefix={<IconButton><StoreIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/coupons/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {(selfCouponList.length > 0) ? (
          <SwipeableTileList half>
            {selfCouponList.map((item, index) => (
                <Tile
                  key={item.id}
                  title={item.product.name}
                  image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                  actions={[
                    <IconButton><DirectionsIcon /></IconButton>,
                    <IconButton
                      onClick={() => router.push({
                        pathname: '/coupons/use/',
                        query: { id: item.id },
                      })}
                    >
                      <CropFreeIcon />
                    </IconButton>
                  ]}
                  onClick={() => router.push(`/coupons/${item.id}/`)}
                />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('myFavoriteStores')}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/favorite-stores/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {(selfFavoriteStoreList.length > 0) ? (
          <SwipeableTileList half>
            {selfFavoriteStoreList.map((item, index) => (
                <Tile
                  key={item.id}
                  title={item.store.name}
                  image={item.store.images.length > 0 ? item.store.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/stores/${item.store.id}/`)}
                />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('myFavoriteProducts')}
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon
              onClick={() => router.push({
                pathname: '/favorite-products/list/',
                query: { user: selfUser.id },
              })}
            />
          </IconButton>
        }
        padding={false}
      >
        {(selfFavoriteProductList.length > 0) ? (
          <SwipeableTileList half>
            {selfFavoriteProductList.map((item, index) => (
                <Tile
                  key={item.id}
                  title={item.product.name}
                  image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/products/${item.product.id}/`)}
                />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Index;
