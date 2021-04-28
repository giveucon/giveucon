import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StorefrontIcon from '@material-ui/icons/Storefront';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getStoreList = async (context) => {
  return await requestToBackend(context, 'api/stores/', 'get', 'json');
};

const getSelfStoreList = async (context, selfUser) => {
  const params = {
    user: selfUser.id,
  }
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const storeListResponse = await getStoreList(context);
  const selfStoreListResponse = await getSelfStoreList(context, selfUser);
  return {
    props: { selfUser, storeList: storeListResponse.data, selfStoreList: selfStoreListResponse.data },
  };
})

function Index({ selfUser, storeList, selfStoreList }) {
  const router = useRouter();
  return (
    <Layout title={`가게 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게'
      >
      </Section>
      <Section
        title='내 가게'
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
        titleSuffix={
          <IconButton 
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        { selfStoreList.results.length > 0 ? (
          <Grid container spacing={1}>
            {selfStoreList.results.slice(0, 4).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                  onClick={() => router.push(`/stores/${item.id}/` )}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content='가게가 없습니다.' variant='information' />
        )}
      </Section>
      <Section
        title='모든 가게'
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
        titleSuffix={
          <IconButton onClick={() => router.push('/stores/list/')}>
            <ArrowForwardIcon />
          </IconButton>}
        padding={false}
      >
        {(storeList.results.length > 0) ? (
          <SwipeableTileList half>
            {storeList.results.slice(0, 10).map((item, index) => {
              return <Tile
                key={index}
                title={item.name}
                image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                actions={[
                  <IconButton><FavoriteIcon /></IconButton>
                ]}
                onClick={() => router.push(`/stores/${item.id}/`)}
              />
            })}
          </SwipeableTileList>
        ) : (
          <AlertBox content='가게가 없습니다.' variant='information' />
        )}
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/stores/create`)}
        >
          새 가게 추가
        </Button>
      </Box>
    </Layout>
  );
}

export default Index;
