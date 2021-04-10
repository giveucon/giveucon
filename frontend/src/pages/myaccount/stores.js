import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

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
    props: { session, selfUser, selfStoreList },
  }
})

function Stores({ session, selfUser, selfStoreList }) {
  const router = useRouter();
  return (
    <>
      <Layout title={"내 가게 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
        <Section
          backButton
          title="내 가게"
        >
          <Grid container>
            {selfStoreList && selfStoreList.map((item, index) => (
              <Grid item xs={6} key={index}>
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
        <Box marginY={1}>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={() => router.push(`/stores/create`)}
          >
            새 가게 추가
          </Button>
        </Box>
      </Layout>
    </>
  );
}

export default Stores;
