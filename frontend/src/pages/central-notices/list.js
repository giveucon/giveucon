import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import AlertBox from '../../components/AlertBox'
import InfiniteScrollLoader from '../../components/InfiniteScrollLoader';
import Layout from '../../components/Layout'
import ListItemCard from '../../components/ListItemCard';
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import Tile from '../../components/Tile';
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getCentralNoticeList = async (context) => {
  return await requestToBackend(context, 'api/central-notices/', 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const initialCentralNoticeListResponse = await getCentralNoticeList(context);
  if (!selfUser.staff && (selfUser.id !== centralResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  return {
    props: { selfUser, initialCentralNoticeListResponse },
  };
})

function List({ selfUser, initialCentralNoticeListResponse }) {

  const router = useRouter();
  const [centralNoticeList, setCentralNoticeList] = useState(initialCentralNoticeListResponse.data.results);
  const [centralNoticeListPagination, setCentralNoticeListPagination] = useState(0);
  const [hasMoreCentralNoticeList, setHasMoreCentralNoticeList] = useState(initialCentralNoticeListResponse.data.next);

  const getMoreCentralNoticeList = async () => {
    const centralNoticeListResponse = await await requestToBackend('api/central-notices/', 'get', 'json', null, {
      page: centralNoticeListPagination + 1,
    });
    setCentralNoticeList(prevCentralNoticeList => (prevCentralNoticeList || []).concat(centralNoticeListResponse.data.results));
    setCentralNoticeListPagination(prevCentralNoticeListPagination => prevCentralNoticeListPagination + 1);
    if (centralNoticeListResponse.data.next === null) setHasMoreCentralNoticeList(prevHasMoreCentralNoticeList => false);
  }

  return (
    <Layout title={`공지사항 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='공지사항'
      />
      <Section
        titlePrefix={<IconButton><AnnouncementIcon /></IconButton>}
        title='최신 공지사항'
        padding={false}
      >
        {centralNoticeList && (
          (centralNoticeList.length > 0) ? (
            <SwipeableTileList autoplay={true}>
              {centralNoticeList.slice(0, 2).map((item, index) => {
                return <Tile
                  key={index}
                  title={item.article.title}
                  image={
                    item.images && (item.images.length > 0)
                    ? item.images[0].image
                    : '/no_image.png'
                  }
                  onClick={() => router.push(`/central-notices/${item.id}`)}
                />
              })}
            </SwipeableTileList>
          ) : (
            <AlertBox content='공지사항이 없습니다.' variant='information' />
          )
        )}
        {!centralNoticeList && (
          <SwipeableTileList autoplay={true}>
            <Tile skeleton/>
          </SwipeableTileList>
        )}
      </Section>

      <Section
        title='전체 공지사항'
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
      >
        {centralNoticeList && (
          (centralNoticeList.length > 0) ? (
            <InfiniteScroll
              dataLength={centralNoticeList.length}
              next={getMoreCentralNoticeList}
              hasMore={hasMoreCentralNoticeList}
              loader={<InfiniteScrollLoader loading={true} />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
             <Grid container>
                {centralNoticeList.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <ListItemCard
                      title={item.article.title}
                      subtitle={new Date(item.article.created_at).toLocaleDateString()}
                      onClick={() => router.push(`/central-notices/${item.id}/`)}
                    />
                  </Grid>
                ))}
                </Grid>
              </InfiniteScroll>
            ) : (
            <AlertBox content='공지사항이 없습니다.' variant='information' />
          )
        )}
        {!centralNoticeList && (
          <Grid container>
            {Array.from(Array(3).keys()).map((item, index) => (
              <Grid item xs={12} key={index}>
                <ListItemCard skeleton/>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      {selfUser && selfUser.staff && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/central-notices/create/`)}
          >
            공지사항 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
