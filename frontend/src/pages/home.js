import React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import BusinessCard from '../components/BusinessCard'
import Layout from '../components/Layout'
import Section from '../components/Section'
import SwipeableBusinessCards from '../components/SwipeableBusinessCards';
import withAuthServerSideProps from './withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session, selfUser },
  }
})

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
    <Layout title={`홈 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
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
        <SwipeableBusinessCards autoplay={true}>
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

export default Home;
