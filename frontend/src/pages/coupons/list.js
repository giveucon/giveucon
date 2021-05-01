import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import useI18n from 'hooks/use-i18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponList = async (context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
    product: context.query.product || null,
  };
  return await requestToBackend(context, 'api/products', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialCouponListResponse = await getCouponList(context);
  const userResponse = context.query.user && await getUser(context);
  const storeResponse = context.query.store && await getStore(context);
  const productResponse = context.query.product && await getProduct(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialCouponListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null,
      product: context.query.product ? productResponse.data : null,
    },
  };
})

function List({ lng, lngDict, selfUser, initialCouponListResponse, user, store, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const [couponList, setCouponList] = useState(initialCouponListResponse.data.results);
  const [couponListPagination, setCouponListPagination] = useState(0);
  const [hasMoreCouponList, setHasMoreCouponList] = useState(initialCouponListResponse.data.next);

  const getMoreCouponList = async () => {
    const couponListResponse = await await requestToBackend('api/coupons/', 'get', 'json', null, {
      user: user ? user.id : null,
      store: store ? store.id : null,
      product: product ? product.id : null,
      page: couponListPagination + 1,
    });
    setCouponList(prevCouponList => (prevCouponList || []).concat(couponListResponse.data.results));
    setCouponListPagination(prevCouponListPagination => prevCouponListPagination + 1);
    if (couponListPagination.data.next === null) setHasMoreCouponList(prevHasMoreCouponList => false);
  }

  return (
    <Layout title={`쿠폰 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 목록'
      >
        {couponList && (
          (couponList.length > 0) ? (
            <InfiniteScroll
              dataLength={couponList.length}
              next={getMoreCouponList}
              hasMore={hasMoreCouponList}
              loader={<InfiniteScrollLoader loading={true} />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              <Grid container spacing={1}>
                {couponList.map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Tile
                      title={`쿠폰 이름`}
                      image='https://cdn.pixabay.com/photo/2017/12/05/05/34/gifts-2998593_960_720.jpg'
                      actions={[
                        <IconButton><DirectionsIcon /></IconButton>,
                        <IconButton><CropFreeIcon /></IconButton>
                      ]}
                      onClick={item.user === selfUser.id
                        ? (() => router.push(`/coupons/${item.id}/`))
                        : null
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          ) : (
            <AlertBox content='쿠폰이 없습니다.' variant='information' />
          )
        )}
      </Section>
    </Layout>
  );
}

export default List;
