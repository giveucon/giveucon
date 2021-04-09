import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import StorefrontIcon from '@material-ui/icons/Storefront';

import BusinessCard from '../../../components/BusinessCard';
import Layout from '../../../components/Layout'
import Tile from '../../../components/Tile';
import Section from '../../../components/Section'
import withAuth from '../../../components/withAuth'


const getSelfUser = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/self", {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getStore = async (session, id) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores/" + id, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getProductList = async (session, store) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/products", {
        params: {
          store: store.id,
        },
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfUser = await getSelfUser(session)
  const store = await getStore(session, context.query.id)
  const productList = await getProductList(session, store)
  return {
    props: { session, selfUser, store, productList }
  }
}

function Index({ session, selfUser, store, productList }) {
  const router = useRouter();
  return (
    <Layout title={store.name + " - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title={store.name}
      >
        <BusinessCard
          title="가게 공지 준비중입니다."
          maxTitleLength={20}
          image="https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
      <Section
        title="상품"
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
        <Grid container>
          {productList.map((item, key) => (
            <Grid item xs={6}>
              <Tile
                title={item.name}
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => router.push({
                  pathname: `/products/${item.id}`,
                })}
                menuItems={
                  <><MenuItem>Menu Item</MenuItem><MenuItem>Menu Item</MenuItem></>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Section>
      { selfUser.id === store.owner && (
        <>
          <Box marginY={1}>
            <Button
              color="primary"
              fullWidth
              variant="contained"
              onClick={() => router.push({
                pathname: '/products/create',
                query: { id: store.id },
              })}
            >
              상품 추가
            </Button>
          </Box>
          <Box marginY={1}>
            <Button
              color="default"
              fullWidth
              variant="contained"
              onClick={() => 
                router.push({
                  pathname: '/stores/update',
                  query: { id: store.id },
                })
              }
            >
              가게 정보 수정
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default withAuth(Index);
