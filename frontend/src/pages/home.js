import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import BusinessCard from '../components/BusinessCard'
import Layout from '../components/Layout'
import Section from '../components/Section'
import SwipeableBusinessCards from '../components/SwipeableBusinessCards';
import withAuthServerSideProps from './withAuthServerSideProps'


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
  const centralNoticeList = await getCentralNoticeList(session)
  return {
    props: { session, selfUser, centralNoticeList },
  }
})

function Home({ session, selfUser, centralNoticeList }) {
  const router = useRouter();
  return (
    <Layout title={`홈 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        title="홈"
        titlePrefix={<IconButton><HomeIcon /></IconButton>}
        titleSuffix={[
          <IconButton onClick={() => router.push('/notices')}>
            <AnnouncementIcon />
          </IconButton>,
          <IconButton>
            <Badge badgeContent={100} color="error" max={99}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        ]}>
        <SwipeableBusinessCards autoplay={true}>
          {centralNoticeList.slice(0, 2).map((item, index) => {
            return <BusinessCard
              key={index}
              title={item.article.title}
              image="https://cdn.pixabay.com/photo/2016/03/09/09/17/computer-1245714_960_720.jpg"
              onClick={() => alert( 'Tapped' )}
            />
          })}
        </SwipeableBusinessCards>
      </Section>
      <Section
        title="위치 기반 추천 시스템"
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
      >
      </Section>
    </Layout>
  );
}

export default Home;
