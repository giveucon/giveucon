import React from 'react';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';

import AlertBox from '../../components/AlertBox'
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

  useEffect(() => {
    const fetch = async () => {
      const couponListResponse = await requestToBackend('api/coupons/', 'get', 'json', null, {
        user: router.query.user || null,
        store: router.query.store || null,
        product: router.query.product || null,
      });
      const userResponse = await requestToBackend(`api/users/${router.query.user}`, 'get', 'json', null, null);
      const storeResponse = await requestToBackend(`api/stores/${router.query.store}`, 'get', 'json', null, null);
      const productResponse = await requestToBackend(`api/products/${router.query.product}`, 'get', 'json', null, null);
      setCouponList(couponListResponse.data);
      setUser(userResponse.data);
      setStore(storeResponse.data);
      setProduct(productResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`쿠폰 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='쿠폰 목록'
      >
        {couponList && (couponList.length > 0) ? (
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
        ) : (
          <AlertBox content='쿠폰이 없습니다.' variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default withAuth(List);
