import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getSelfStoreList = async (session, selfUser) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/stores", {
        params: {
          user: selfUser.id,
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

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const selfStoreList = await getSelfStoreList(session, selfUser)
  return {
    props: { selfUser, selfStoreList },
  }
})

function Stores({ selfUser, selfStoreList }) {
  const router = useRouter();
  return (
    <>
      <Layout title={"내 가게 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
        <Section
          backButton
          title="내 가게"
        >
          <Grid container>
            {selfStoreList && selfStoreList.map((item, key) => (
              <Grid item xs={6}>
                <Tile
                  title={item.name}
                  image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
                  onClick={() => 
                    router.push(`/stores/${item.id}`
                  )}
                  menuItems={
                    <MenuItem>Menu Item</MenuItem>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Section>
        <Fab
          color="primary"
          onClick={() => router.push(`/stores/create`)}
        >
          <AddIcon />
        </Fab>
      </Layout>
    </>
  );
}

export default Stores;
