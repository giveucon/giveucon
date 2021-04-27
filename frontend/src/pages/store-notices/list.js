import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getStoreNoticeList = async (context) => {
  return await requestToBackend(context, 'api/store-notices/', 'get', 'json', null, {
    store: context.query.store,
  });
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const initialStoreNoticeListResponse = await getStoreNoticeList(context);
  const storeResponse = await getStore(session, initialStoreNoticeListResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  return {
    props: { selfUser, initialStoreNoticeListResponse },
  };
})

function List({ selfUser, initialStoreNoticeList }) {

  const router = useRouter();
  const [storeNoticeList, setStoreNoticeList] = useState(initialStoreNoticeListResponse.data.results);
  const [storeNoticeListPagination, setStoreNoticeListPagination] = useState(0);
  const [hasMoreStoreNoticeList, setHasMoreStoreNoticeList] = useState(initialStoreNoticeListResponse.data.next);

  const getMoreStoreNoticeList = async () => {
    const storeNoticeListResponse = await await requestToBackend('api/store-notices/', 'get', 'json', null, {
      page: storeNoticeListPagination + 1,
    });
    setStoreNoticeList(prevStoreNoticeList => (prevStoreNoticeList || []).concat(storeNoticeListResponse.data.results));
    setStoreNoticeListPagination(prevStoreNoticeListPagination => prevStoreNoticeListPagination + 1);
    if (storeNoticeListResponse.data.next === null) setHasMoreStoreNoticeList(prevHasMoreStoreNoticeList => false);
  }

  return (
    <Layout title={`가게 공지사항 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 목록'
      >
        {storeList && (
          (storeList.length > 0) ? (
            <InfiniteScroll
              dataLength={storeNoticeList.length}
              next={getMoreStoreNoticeList}
              hasMore={hasMoreStoreNoticeList}
              loader={<InfiniteScrollLoader loading={true} />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              <Grid container>
                {storeList && storeList.map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Tile
                      title={item.name}
                      image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                      onClick={() => router.push(`/store-notices/${item.id}/`)}
                      menuItems={
                        <MenuItem>Menu Item</MenuItem>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          ) : (
            <AlertBox content='가게 공지사항이 없습니다.' variant='information' />
          )
        )}
      </Section>
      { store && (store.user === selfUser.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-notices/create/',
              query: { store: store.id },
            })}
          >
            새 가게 공지사항 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
