import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import AlertBox from '../../components/AlertBox';
import Tile from '../../components/Tile';
import KakaoMapBox from '../../components/KakaoMapBox';
import Layout from '../../components/Layout'
import ListItemCard from '../../components/ListItemCard'
import Tile from '../../components/Tile';
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

const latitude = 37.506502;
const longitude = 127.053617;

function Id({ selfUser }) {

  const router = useRouter();
  const [store, setStore] = useState(null);
  const [storeNoticeList, setStoreNoticeList] = useState(null);
  const [productList, setProductList] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const storeResponse = await requestToBackend(`api/stores/${router.query.id}`, 'get', 'json', null, null);
      const storeNoticeListResponse = await requestToBackend('api/store-notices/', 'get', 'json', null, {
        user: storeResponse.data.user
      });
      const productListResponse = await requestToBackend('api/products/', 'get', 'json', null, {
        user: storeResponse.data.user
      });
      setStore(storeResponse.data);
      setStoreNoticeList(storeNoticeListResponse.data);
      setProductList(productListResponse.data);
    }
    fetch();
  }, []);

  return (
    <Layout title={`${store ? store.name : '로딩중'} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={store ? store.name : '로딩중'}
        padding={false}
      >
        {
          store ? (
            <>
              <SwipeableTileList autoplay={true}>
                {store.images && (store.images.length > 0) ? (
                  store.images.map((item, index) => {
                    return <Tile
                      key={index}
                      image={item.image}
                      onClick={() => router.push(`/images/${item.id}/` )}
                    />})
                  ) : (
                    <Tile image='/no_image.png' />
                  )
                }
              </SwipeableTileList>
              <Box padding={1}>
                {
                  store.tags && (store.tags.length > 0) && store.tags.map((item, index) => (
                    <Chip
                      key={index}
                      label={item.name}
                      color='primary'
                      size='small'
                      variant='outlined'
                      // onClick={() => router.push(`/tags/${item.id}/`)}
                    />
                  ))
                }
              </Box>
              <Box padding={1}>
                <Typography>{store.description}</Typography>
              </Box>
            </>
          ) : (
            <></>
          )
        }
      </Section>
      <Section
        title='가게 공지사항'
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
        titleSuffix={<IconButton><ArrowForwardIcon /></IconButton>}
      >
        {storeNoticeList ? (
          storeNoticeList.length > 0 ? (
            <Grid container spacing={1}>
            {storeNoticeList.slice(0, 4).map((item, index) => (
              <Grid item xs={12} key={index}>
                <ListItemCard
                  title={item.article.title}
                  subtitle={new Date(item.article.created_at).toLocaleDateString()}
                  onClick={() => router.push(`/store-notices/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
          ) : (
            <AlertBox content='공지사항이 없습니다.' variant='information' />
          )
        ) : (
          <></>
        )}
      </Section>
      <Section
        title='상품'
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={<IconButton><ArrowForwardIcon /></IconButton>}
      >
        {productList ? (
          productList.length > 0 ? (
            <Grid container spacing={1}>
            {productList && productList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  margin={false}
                  title={item.name}
                  subtitle={item.price.toLocaleString('ko-KR') + '원'}
                  image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                  actions={[
                    <IconButton><FavoriteIcon /></IconButton>
                  ]}
                  onClick={() => router.push(`/products/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
          ) : (
            <AlertBox content='상품이 없습니다.' variant='information' />
          )
        ) : (
          <></>
        )}
      </Section>
      <Section
        title='가게 위치'
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
        <Card>
          <KakaoMapBox latitude={latitude} longitude={longitude}/>
        </Card>
      </Section>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`https://map.kakao.com/link/map/${latitude},${longitude}`)}
        >
          경로 검색
        </Button>
      </Box>
      {selfUser && store && (selfUser.id === store.user) && (
        <>
          <Box marginY={1}>
            <Button
              color='primary'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/products/create/',
                query: { id: store.id },
              })}
            >
              새 상품 추가
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/store-notices/create/',
                query: { store: store.id },
              })}
            >
              가게 공지사항 추가
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={() => router.push({
                pathname: '/stores/update/',
                query: { store: store.id },
              })}
            >
              가게 정보 수정
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default withAuth(Id);
