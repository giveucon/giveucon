import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import AlertBox from '../../components/AlertBox'
import BusinessCard from '../../components/BusinessCard';
import Layout from '../../components/Layout'
import ListItemCard from '../../components/ListItemCard';
import Section from '../../components/Section'
import SwipeableBusinessCardList from '../../components/SwipeableBusinessCardList';
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const getCentralNoticeList = async (session) => {
  return await requestToBackend(session, 'api/central-notices/', 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const centralNoticeListResponse = await getCentralNoticeList(session);
  return {
    props: { session, selfUser, centralNoticeList: centralNoticeListResponse.data },
  };
})

function Index({ session, selfUser, centralNoticeList }) {
  const router = useRouter();
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
        {centralNoticeList && (centralNoticeList.length > 0) ? (
          <SwipeableBusinessCardList autoplay={true}>
            {centralNoticeList.slice(0, 2).map((item, index) => {
              return <BusinessCard
                key={index}
                title={item.article.title}
                image={
                  item.images && (item.images.length > 0)
                  ? item.images[0].image
                  : '/no_image.png'
                }
                onClick={() => router.push(`/notices/${item.id}`)}
              />
            })}
          </SwipeableBusinessCardList>
        ) : (
          <AlertBox content='공지사항이 없습니다.' variant='information' />
        )}
      </Section>
      <Section
        title='전체 공지사항'
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
      >
        { centralNoticeList && (centralNoticeList.length > 0) ? centralNoticeList.map((item, index) => (
          <Grid item xs={12} key={index}>
            <ListItemCard
              title={item.article.title}
              subtitle={new Date(item.article.created_at).toLocaleDateString()}
              onClick={() => router.push(`/central-notices/${item.id}/`)}
            />
          </Grid>
        )) : (
          <AlertBox content='공지사항이 없습니다.' variant='information' />
        )}
      </Section>
      {selfUser.staff && (
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

export default Index;
