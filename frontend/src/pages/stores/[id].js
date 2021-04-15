import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import BusinessCard from '../../components/BusinessCard';
import KakaoMapBox from '../../components/KakaoMapBox';
import Layout from '../../components/Layout'
import ListItemCard from '../../components/ListItemCard'
import Tile from '../../components/Tile';
import Section from '../../components/Section'
import SwipeableBusinessCardList from '../../components/SwipeableBusinessCardList';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStore = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/${context.query.id}/`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

const getProductList = async (session, store) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products/`, {
        params: {
          store: store.id,
        },
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const storeResponse = await getStore(session, context)
  const productListResponse = await getProductList(session, storeResponse.data)
  return {
    props: { session, selfUser, store: storeResponse.data, productList: productListResponse.data },
  }
})

const latitude = 37.506502;
const longitude = 127.053617;

function Id({ session, selfUser, store, productList }) {
  const router = useRouter();
  return (
    <Layout title={`${store.name} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={store.name}
        padding={false}
      >
        { store.images && (
          <SwipeableBusinessCardList autoplay={true}>
            {store.images.map((item, index) => {
              return <BusinessCard
                key={index}
                image={item.image}
                onClick={() => router.push(`/images/${item.id}/` )}
              />
            })}
          </SwipeableBusinessCardList>
        )}
        <Box padding={1}>
          <Typography>{store.description}</Typography>
        </Box>
      </Section>
      <Section
        title='공지사항'
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={<><IconButton><ArrowForwardIcon /></IconButton></>}
      >
        { store.notices && (store.notices.length > 0) ? (
          <Grid container spacing={1}>
            {store.notices.slice(0, 4).map((item, index) => (
              <Grid item xs={12} key={index}>
                <ListItemCard
                  title={item.name}
                  subtitle={item.price.toLocaleString('ko-KR') + '원'}
                  // onClick={() => router.push(`/stores/notices/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
        <Box margin={0.5}>
          <Typography>공지사항이 없습니다.</Typography>
        </Box>
        )}
      </Section>
      <Section
        title='상품'
        titlePrefix={<IconButton><ShoppingBasketIcon /></IconButton>}
        titleSuffix={<><IconButton><ArrowForwardIcon /></IconButton></>}
      >
        <Grid container spacing={1}>
          {productList.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Tile
                margin={false}
                title={item.name}
                subtitle={item.price.toLocaleString('ko-KR') + '원'}
                image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
                actions={[
                  <IconButton><FavoriteIcon /></IconButton>
                ]}
                onClick={() => router.push(`/products/${item.id}/`)}
              />
            </Grid>
          ))}
        </Grid>
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
      { selfUser.id === store.user && (
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
                pathname: '/stores/update/',
                query: { id: store.id },
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

export default Id;
