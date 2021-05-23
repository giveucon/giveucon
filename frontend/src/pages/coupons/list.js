import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import CouponBox from 'components/CouponBox'
import CouponListItem from 'components/CouponListItem';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponList = async (context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
    product: context.query.product || null,
  };
  return await requestToBackend(context, 'api/coupons', 'get', 'json', null, params);
};

const getUser = async (context) => await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');

const getStore = async (context) => await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');

const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialCouponListResponse = await getCouponList(context);
  if (initialCouponListResponse.status === 404) {
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
      initialCouponListResponse,
      user: context.query.user ? userResponse.data : null,
      store: context.query.store ? storeResponse.data : null,
      product: context.query.product ? productResponse.data : null,
      group: context.query.group || false
    }
  }
})

function List({ lng, lngDict, selfUser, initialCouponListResponse, user, store, product, group }) {

  const i18n = useI18n();
  const router = useRouter();
  const [couponList, setCouponList] = useState(initialCouponListResponse.data.results);
  const [couponListpage, setCouponListpage] = useState(1);
  const [hasMoreCouponList, setHasMoreCouponList] = useState(initialCouponListResponse.data.next);
  const getMoreCouponList = async () => {
    const couponListResponse = await await requestToBackend(null, 'api/coupons/', 'get', 'json', null, {
      user: user ? user.id : null,
      store: store ? store.id : null,
      product: product ? product.id : null,
      page: couponListpage + 1,
    });
    setCouponList(prevCouponList => (prevCouponList || []).concat(couponListResponse.data.results));
    setCouponListpage(prevCouponListpage => prevCouponListpage + 1);
    if (couponListpage.data.next === null) setHasMoreCouponList(prevHasMoreCouponList => false);
  }

  if (product && group) {
    return (
      <Layout
        lng={lng}
      lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('couponList')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={product.name}
        >
          <CouponBox
            lng={lng}
            lngDict={lngDict}
            name={product.name}
            image={product.images.length > 0 ? product.images[0].image : constants.NO_IMAGE_PATH}
            price={product.price}
          />
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push(`/products/${product.id}/`)}
            >
              {i18n.t('goToProduct')}
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
            >
              {i18n.t('findPath')}
            </Button>
          </Box>
        </Section>
          <Section
            title={i18n.t('couponList')}
            titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
          >
            {couponList && (
              (couponList.length > 0) ? (
                <InfiniteScroll
                  dataLength={couponList.length}
                  next={getMoreCouponList}
                  hasMore={hasMoreCouponList}
                  loader={<InfiniteScrollLoader loading />}
                  endMessage={<InfiniteScrollLoader loading={false} />}
                >
                  {couponList.map((item, index) => (
                    <>
                      <CouponListItem
                        title={item.product.name}
                        subtitle={new Date(item.created_at).toLocaleDateString()}
                        suffix={[
                          <IconButton>
                            <CropFreeIcon
                              onClick={() => router.push({
                                pathname: '/coupons/use/',
                                query: { id: item.id },
                              })}
                            />
                          </IconButton>
                        ]}
                        onClick={() => router.push(`/coupons/${item.id}/`)}
                      />
                    {index < couponList.length - 1 && (<Divider />)}
                    </>
                  ))}
                </InfiniteScroll>
            ) : (
              <AlertBox content={i18n.t('_isEmpty')} variant='information' />
            )
          )}
        </Section>
      </Layout>
    )
  }


    return (
      <Layout
        lng={lng}
      lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('couponList')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={i18n.t('couponList')}
          padding={false}
        >
          {couponList && (
            (couponList.length > 0) ? (
              <InfiniteScroll
                dataLength={couponList.length}
                next={getMoreCouponList}
                hasMore={hasMoreCouponList}
                loader={<InfiniteScrollLoader loading />}
                endMessage={<InfiniteScrollLoader loading={false} />}
              >
                <Grid container>
                  {couponList.map((item, index) => (
                    <Grid item xs={6} key={item.id}>
                      <Tile
                        title={item.product.name}
                        image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                        actions={[
                          <IconButton
                            onClick={() => router.push(`https://map.kakao.com/link/to/${item.product.store.name},${item.product.store.location.latitude},${item.product.store.location.longitude}`)}
                          >
                            <DirectionsIcon/>
                          </IconButton>,
                          <IconButton>
                            <CropFreeIcon
                              onClick={() => router.push({
                                pathname: '/coupons/use/',
                                query: { id: item.id },
                              })}
                            />
                          </IconButton>
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
              <AlertBox content={i18n.t('_isEmpty')} variant='information' />
            )
          )}
        </Section>
      </Layout>
    );


}

export default List;
