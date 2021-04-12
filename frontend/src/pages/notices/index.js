import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import BusinessCard from '../../components/BusinessCard';
import ListItemCard from '../../components/ListItemCard';
import SwipeableBusinessCards from '../../components/SwipeableBusinessCards';
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCentralNoticeList = async (session) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/central-notices`, {
        headers: {
          'Authorization': "Bearer " + session.accessToken,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const noticeList = await getCentralNoticeList(session)
  return {
    props: { session, selfUser, noticeList },
  }
})

function Index({ session, selfUser, noticeList }) {
  const router = useRouter();
  return (
    <Layout title={`공지 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title="공지"
      />
      <Section
        titlePrefix={<IconButton><AnnouncementIcon /></IconButton>}
        title="최신 공지"
      >
        <SwipeableBusinessCards autoplay={true}>
          {noticeList.slice(0, 2).map((item, index) => {
            return <BusinessCard
              key={index}
              title={item.article.title}
              image="https://cdn.pixabay.com/photo/2016/03/09/09/17/computer-1245714_960_720.jpg"
              onClick={() =>  router.push(`/notices/${item.id}` )}
            />
          })}
        </SwipeableBusinessCards>
      </Section>
      <Section
        title="전체 공지"
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
      >
        {noticeList.map((item, index) => (
          <Grid item xs={12} key={index}>
            <ListItemCard
              primary={item.article.title}
              secondary={new Date(item.article.created_at).toLocaleDateString()}
              onClick={() =>  router.push(`/notices/${item.id}` )}
            />
          </Grid>
        ))}
      </Section>
    </Layout>
  );
}

export default Index;
