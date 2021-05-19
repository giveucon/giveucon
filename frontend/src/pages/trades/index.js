import React from 'react';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
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

const getSelfCouponSellingList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/coupon-sellings', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfCouponSellingListResponse = await getSelfCouponSellingList(context, selfUser);
  if (selfCouponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, selfCouponSellingListResponse }
  }
})

function Index({ lng, lngDict, selfUser, selfCouponSellingListResponse }) {
  
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
        {selfCouponSellingListResponse.length > 0 ? (
          <SwipeableTileList half>
            {selfCouponSellingListResponse.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => (
              <Tile
                key={index}
                title={item.coupon.product.name}
                image={
                  item.coupon.product.images && (item.coupon.product.images.length > 0)
                  ? item.coupon.product.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/coupons/${item.id}/`)}
                actions={[
                  <IconButton><DirectionsIcon /></IconButton>,
                  <IconButton>
                    <CropFreeIcon
                      onClick={() => router.push({
                        pathname: '/coupons/use/',
                        query: { id: item.id },
                      })}
                    />
                  </IconButton>
                ]}
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
