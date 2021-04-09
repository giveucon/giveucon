import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import BusinessCard from '../components/BusinessCard'
import Layout from '../components/Layout'
import Section from '../components/Section'
import SwipeableBusinessCards from '../components/SwipeableBusinessCards';
import withAuth from '../components/withAuth'

const getSelfUser = async (session) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api/users/self", {
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

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const selfUser = await getSelfUser(session)
  return {
    props: { session, selfUser }
  }
}

const centralNotices = [
  <BusinessCard
    title="giveUcon 준비중입니다."
    maxTitleLength={20}
    image="https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg"
    onClick={() => alert( 'Tapped' )}
  />,
  <BusinessCard
    title="giveUcon 준비중입니다."
    maxTitleLength={20}
    image="https://cdn.pixabay.com/photo/2018/09/25/23/40/baukran-3703469_960_720.jpg"
    onClick={() => alert( 'Tapped' )}
  />,
  <BusinessCard
    title="giveUcon 준비중입니다."
    maxTitleLength={20}
    image="https://cdn.pixabay.com/photo/2016/03/09/09/17/computer-1245714_960_720.jpg"
    onClick={() => alert( 'Tapped' )}
  />,
]

function Home({ session, selfUser }) {

  return (
    <Layout title={"홈 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
      <Section
        title="홈"
        titlePrefix={<IconButton><HomeIcon /></IconButton>}
        titleSuffix={
          <IconButton>
            <Badge badgeContent={100} color="error" max={99}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        }>
        <SwipeableBusinessCards autoplay={true} interval={5000}>
          {centralNotices}
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

export default withAuth(Home);
