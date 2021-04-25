import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import AlertBox from '../../components/AlertBox';
import InfiniteScrollLoader from '../../components/InfiniteScrollLoader';
import Layout from '../../components/Layout';
import Section from '../../components/Section';
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend';
import withAuth from '../../utils/withAuth';

function List({ selfUser }) {

  const router = useRouter();
  const [storeList, setStoreList] = useState(null);
  const [user, setUser] = useState(null);
  const [storeListPagination, setStoreListPagination] = useState(0);
  const [hasMoreStoreList, setHasMoreStoreList] = useState(true);

  const getStoreList = async (user, page) => {
    return await requestToBackend('api/stores/', 'get', 'json', null, {
      user,
      page,
    });
  };
  
  const getUser = async (user) => {
    return await requestToBackend(`api/users/${user}`, 'get', 'json', null, null);
  };

  const getMoreStoreList = async () => {
    const storeListResponse = await getStoreList(
      router.query.user,
      storeListPagination + 1
    );
    setStoreList(prevStoreList => (prevStoreList || []).concat(storeListResponse.data.results));
    setStoreListPagination(prevStoreListPagination => prevStoreListPagination + 1);
    if (storeListResponse.data.next === null) setHasMoreStoreList(prevHasMoreStoreList => false);
  }

  useEffect(() => {
    const fetch = async () => {
      await getMoreStoreList();
      if (router.query.user) {
        const userResponse = await getUser(router.query.user);
        setUser(userResponse.data);
      }
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`가게 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
        <Section
          backButton
          title='가게 목록'
        >
          {storeList && (
            (storeList.length > 0) ? (
              <InfiniteScroll
                dataLength={storeList.length}
                next={getMoreStoreList}
                hasMore={hasMoreStoreList}
                loader={<InfiniteScrollLoader loading={true} />}
                endMessage={<InfiniteScrollLoader loading={false} />}
              >
                <Grid container spacing={1}>
                  {storeList && storeList.map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Tile
                        title={item.name}
                        image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                        onClick={() => router.push(`/stores/${item.id}/`)}
                        menuItems={
                          <MenuItem>Menu Item</MenuItem>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <AlertBox content='가게가 없습니다.' variant='information' />
            )
          )}
          {!storeList && (
            <Grid container spacing={1}>
              {Array.from(Array(4).keys()).map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile skeleton/>
                </Grid>
              ))}
            </Grid>
          )}
        </Section>
        {user && (user.id === selfUser.id) && (
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

export default withAuth(List);
