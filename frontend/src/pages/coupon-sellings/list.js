import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@material-ui/core/Grid';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSellingList = async (context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
    product: context.query.product || null,
  };
  return await requestToBackend(context, 'api/coupon-sellings', 'get', 'json', null, params);
};

const getUser = async (context) => await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
const getStore = async (context) => await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialCouponSellingListResponse = await getCouponSellingList(context);
  if (initialCouponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const userResponse = context.query.user && await getUser(context);
  const storeResponse = context.query.store && await getStore(context);
  const productResponse = context.query.product && await getProduct(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialCouponSellingListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null,
      product: context.query.product ? productResponse.data : null,
      group: context.query.group || false
    }
  }
})

function List({ lng, lngDict, selfUser, initialCouponSellingListResponse, user, store, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const [couponSellingList, setCouponSellingList] = useState(initialCouponSellingListResponse.data.results);
  const [couponSellingListpage, setCouponSellingListpage] = useState(1);
  const [hasMoreCouponSellingList, setHasMoreCouponSellingList] = useState(initialCouponSellingListResponse.data.next);
  const getMoreCouponSellingList = async () => {
    const couponSellingListResponse = await requestToBackend(null, 'api/coupon-sellings/', 'get', 'json', null, {
      user: user ? user.id : null,
      store: store ? store.id : null,
      product: product ? product.id : null,
      page: couponSellingListpage + 1,
    });
    setCouponSellingList(prevCouponSellingList => (prevCouponSellingList || []).concat(couponSellingListResponse.data.results));
    setCouponSellingListpage(prevCouponSellingListpage => prevCouponSellingListpage + 1);
    if (couponSellingListpage.data.next === null) setHasMoreCouponSellingList(prevHasMoreCouponSellingList => false);
  }

  console.log(initialCouponSellingListResponse);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('couponTradeList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('couponTradeList')}
        padding={false}
      >
        {couponSellingList && (
          (couponSellingList.length > 0) ? (
            <InfiniteScroll
              dataLength={couponSellingList.length}
              next={getMoreCouponSellingList}
              hasMore={hasMoreCouponSellingList}
              loader={<InfiniteScrollLoader loading />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              <Grid container>
                {couponSellingList.map((item, index) => (
                  <Grid item xs={6} key={item.id}>
                    <Tile
                      title={item.coupon.product.name}
                      image={item.coupon.product.images.length > 0 ? item.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
                      onClick={() => router.push(`/coupon-sellings/${item.id}/`)}
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          ) : (
            <AlertBox content={i18n.t('_isEmpty')} variant='information' />
          )
        )}
      </Section>
    </Layout>
  );

}

export default List;
