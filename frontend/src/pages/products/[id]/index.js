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

const getProduct = async (session, id) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/products/" + id, {
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
  const product = await getProduct(session, context.query.id)
  return {
    props: { session, selfUser, product }
  }
}

function Index({ session, selfUser, product }) {
  const router = useRouter();
  return (
    <Layout title={product.name + " - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title={product.name}
      >
        <BusinessCard
          title="상품 설명 준비중입니다."
          maxTitleLength={20}
          image="https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
      { selfUser.id === product.owner && (
        <>
          <Box marginY={1}>
            <Button
              color="default"
              fullWidth
              variant="contained"
              onClick={() => 
                router.push({
                  pathname: '/products/update',
                  query: { id: store.id },
                })
              }
            >
              상품 정보 수정
            </Button>
          </Box>
        </>
      )}
    </Layout>
  );
}

export default withAuth(Index);
