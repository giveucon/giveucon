import React, { useState } from 'react';
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
import withAuthServerSideProps from '../../utils/withAuthServerSideProps';

const getStoreList = async (context) => {
  const params = {
    user: context.query.user || null,
  };
  return await requestToBackend(context, 'api/stores/', 'get', 'json', null, params);
};

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.user}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const initialStoreListResponse = await getStoreList(context);
  const userResponse = context.query.user ? await getUser(context) : null;
  return {
    props: { 
      selfUser,
      initialStoreListResponse,
      user: context.query.user ? userResponse.data : null
     },
  };
})

function List({ selfUser, initialStoreListResponse, user }) {

  const router = useRouter();
  const [storeList, setStoreList] = useState(initialStoreListResponse.data.results);
  const [storeListPagination, setStoreListPagination] = useState(1);
  const [hasMoreStoreList, setHasMoreStoreList] = useState(initialStoreListResponse.data.next);

  const getMoreStoreList = async () => {
    const params = {
      user: user ? user.id : null,
      page: storeListPagination + 1,
    };
    const storeListResponse = await requestToBackend(null, 'api/stores/', 'get', 'json', null, params);
    console.log(storeListResponse.data.results);
    setStoreList(prevStoreList => prevStoreList.concat(storeListResponse.data.results));
    setStoreListPagination(prevStoreListPagination => prevStoreListPagination + 1);
    if (storeListResponse.data.next === null) setHasMoreStoreList(prevHasMoreStoreList => false);
  }

  return (
    <Layout title={`가게 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
        <Section
          backButton
          title='가게 목록'
        >
          {(storeList.length > 0) ? (
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

export default List;
