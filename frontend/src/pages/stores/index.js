import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStoreList = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/stores/`, {
        params,
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

const getUser = async (session, context) => {
  try {
    let params = new Object;
    if (context.query.user) { params.user = context.query.user };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/`, {
        params,
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
  const storeListResponse = await getStoreList(session, context)
  const userResponse = await getUser(session, context)
  return {
    props: { session, selfUser, storeList: storeListResponse.data, user: userResponse.data },
  }
})

function Index({ session, selfUser, storeList, user }) {
  const router = useRouter();
  return (
    <Layout title={`가게 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 목록'
      >
        {storeList && (storeList.length > 0) ? (
          <Grid container>
            {storeList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image='https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg'
                  onClick={() => router.push(`/stores/${item.id}/`)}
                  menuItems={
                    <MenuItem>Menu Item</MenuItem>
                  }
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content='가게가 없습니다.' variant='information' />
        )}
      </Section>
      { user && (user.id === selfUser.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/stores/create/`)}
          >
            새 가게 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Index;
