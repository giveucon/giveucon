import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';

import BusinessCard from '../components/BusinessCard'
import Layout from '../components/Layout'
import Section from '../components/Section'
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
        <BusinessCard
          title="giveUcon 준비중입니다."
          maxTitleLength={20}
          image="https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg"
          onClick={() => alert( 'Tapped' )}
        />
      </Section>
    </Layout>
  );
}

export default withAuth(Home);
