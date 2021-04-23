import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import AlertBox from '../../components/AlertBox'
import Tile from '../../components/Tile';
import Layout from '../../components/Layout'
import ListItemCard from '../../components/ListItemCard';
import Section from '../../components/Section'
import SwipeableTileList from '../../components/SwipeableTileList';
import requestToBackend from '../../utils/requestToBackend'
import withAuth from '../../utils/withAuth'

function Index({ selfUser }) {

  const router = useRouter();
  const [centralNoticeList, setCentralNoticeList] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const centralNoticeListResponse = await requestToBackend('api/central-notices/', 'get', 'json', null, null);
      setCentralNoticeList(centralNoticeListResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

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

export default withAuth(Index);
