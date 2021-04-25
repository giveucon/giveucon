import React from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';

import AlertBox from '../../components/AlertBox'
import InfiniteScrollLoader from '../../components/InfiniteScrollLoader';
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function List({ selfUser }) {

  const router = useRouter();
  const [couponList, setCouponList] = useState(null);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [product, setProduct] = useState(null);
  const [couponListPagination, setCouponListPagination] = useState(0);
  const [hasMoreCouponList, setHasMoreCouponList] = useState(true);

  const getCouponList = async (user, store, product, page) => {
    return await requestToBackend('api/coupons/', 'get', 'json', null, {
      user,
      store,
      product,
      page,
    });
  };
  
  const getUser = async (user) => {
    return await requestToBackend(`api/users/${user}`, 'get', 'json', null, null);
  };

  const getStore = async (store) => {
    return await requestToBackend(`api/stores/${store}`, 'get', 'json', null, null);
  };

  const getProduct = async (product) => {
    return await requestToBackend(`api/products/${product}`, 'get', 'json', null, null);
  };

  const getMoreCouponList = async () => {
    const couponListResponse = await getCouponList(
      router.query.user,
      router.query.store,
      router.query.product,
      couponListPagination + 1
    );
    setCouponList(prevCouponList => (prevCouponList || []).concat(couponListResponse.data.results));
    setCouponListPagination(prevCouponListPagination => prevCouponListPagination + 1);
    if (couponListPagination.data.next === null) setHasMoreCouponList(prevHasMoreCouponList => false);
  }

  useEffect(() => {
    const fetch = async () => {
      await getMoreCouponList();
      if (router.query.user) {
        const userResponse = await getUser(router.query.user);
        setUser(userResponse.data);
      }
      if (router.query.store) {
        const storeResponse = await getStore(router.query.store);
        setStore(storeResponse.data);
      }
      if (router.query.product) {
        const productResponse = await getProduct(router.query.product);
        setProduct(productResponse.data);
      }
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`쿠폰 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 목록'
      >
        {couponList && (
          (couponList.length > 0) ? (
            <InfiniteScroll
              dataLength={CouponList.length}
              next={getMoreCouponList}
              hasMore={hasMoreCouponList}
              loader={<InfiniteScrollLoader loading={true} />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              <Grid container>
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

export default withAuth(List);
