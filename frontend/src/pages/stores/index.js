import React, { useEffect, useState } from 'react';
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
import withAuth from '../../utils/withAuth'

function Index({ selfUser }) {

  const router = useRouter();
  const [storeList, setStoreList] = useState(null);
  const [selfStoreList, setSelfStoreList] = useState(null);

  const getStoreList = async () => {
    return await requestToBackend(`api/stores/`, 'get', 'json', null, null);
  };

  const getSelfStoreList = async (selfUser) => {
    return await requestToBackend(`api/stores/`, 'get', 'json', null, {
      user: selfUser.id
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const storeListResponse = await getStoreList();
      const selfStoreListResponse = await getSelfStoreList(selfUser);
      setStoreList(storeListResponse.data.results);
      setSelfStoreList(selfStoreListResponse.data.results);
    }
    selfUser && fetch();
  }, [selfUser]);

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
        {selfStoreList && (
          selfStoreList.length > 0 ? (
            <Grid container spacing={1}>
              {selfStoreList.slice(0, 4).map((item, index) => (
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
          )
        )}
        {!selfStoreList && (
          <Grid container spacing={1}>
            {Array.from(Array(2).keys()).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile skeleton />
              </Grid>
            ))}
          </Grid>
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
        {storeList && (
          storeList.length > 0 ? (
            <SwipeableTileList half>
              {storeList.slice(0, 10).map((item, index) => {
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
          )
        )}
        {!storeList && (
          <SwipeableTileList half>
            {Array.from(Array(2).keys()).map((item, index) => (
              <Tile skeleton />
            ))}
          </SwipeableTileList>
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

export default withAuth(Index);
