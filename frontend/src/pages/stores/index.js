import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import StorefrontIcon from '@material-ui/icons/Storefront';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuth from '../../components/withAuth'

const getStoreList = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores", {
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
  const storeList = await getStoreList(session)
  return {
    props: { session, storeList }
  }
}

function Index({storeList}) {
  const router = useRouter();
  return (
    <Layout title={"가게 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        backButton
        title="가게"
      >
      </Section>
      <Section
        title="모든 가게"
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
      >
        <Grid container>
          {storeList && storeList.map((item, key) => (
            <Grid item xs={6}>
              <Tile
                title={item.name}
                image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                onClick={() => router.push(`/stores/${item.id}`)}
                menuItems={
                  <><MenuItem>Menu Item</MenuItem><MenuItem>Menu Item</MenuItem></>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

export default withAuth(Index);
