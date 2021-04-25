import React, { useEffect, useState } from 'react';
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
import withAuth from '../../utils/withAuth'

function List({ selfUser }) {

  const router = useRouter();
  const [storeNoticeList, setStoreNoticeList] = useState(null);
  const [storeNoticePagination, setStoreNoticePagination] = useState(0);
  const [hasMoreStoreNoticeList, setHasMoreStoreNoticeList] = useState(true);

  const getStoreNoticeList = async (page) => {
    return await requestToBackend('api/store-notices/', 'get', 'json', null, {
      page
    });
  };
  
  const getMoreStoreNoticeList = async () => {
    const storeNoticeListResponse = await getStoreNoticeList(storeNoticePagination + 1);
    setStoreNoticeList(prevStoreNoticeList => (prevStoreNoticeList || []).concat(storeNoticeListResponse.data.results));
    setStoreNoticePagination(prevStoreNoticeListPagination => prevStoreNoticeListPagination + 1);
    if (storeNoticeListResponse.data.next === null) setHasMoreStoreNoticeList(prevHasMoreStoreNoticeList => false);
  }

  useEffect(() => {
    const fetch = async () => await getMoreStoreNoticeList();
    selfUser && fetch();
  }, [selfUser]);

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

export default withAuth(List);
