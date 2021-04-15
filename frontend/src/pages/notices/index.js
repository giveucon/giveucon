import React from 'react';
import { useRouter } from 'next/router'
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
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCentralNoticeList = async (session) => {
  return await requestToBackend(session, 'api/central-notices/', 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const noticeListResponse = await getCentralNoticeList(session);
  return {
    props: { session, selfUser, noticeList: noticeListResponse.data },
  };
})

function Index({ session, selfUser, noticeList }) {
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
        {noticeList && (noticeList.length > 0) ? (
          <SwipeableBusinessCardList autoplay={true}>
            {noticeList.slice(0, 2).map((item, index) => {
              return <BusinessCard
                key={index}
                title={item.article.title}
                image='https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg'
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
        { noticeList && (noticeList.length > 0) ? noticeList.map((item, index) => (
          <Grid item xs={12} key={index}>
            <ListItemCard
              primary={item.article.title}
              secondary={new Date(item.article.created_at).toLocaleDateString()}
              onClick={() => router.push(`/notices/${item.id}/`)}
            />
          </Grid>
        )) : (
          <AlertBox content='공지사항이 없습니다.' variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Index;
