import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCentralNotice = async (session, id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/central-notices/${id}`, {
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
  const noticeList = await getCentralNotice(session, context.query.id)
  return {
    props: { session, selfUser, noticeList },
  }
})

function Id({ session, selfUser, noticeList }) {
  const router = useRouter();
  return (
    <Layout title={`공지 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={noticeList.article.title}
      >
        <ArticleBox
          title={noticeList.article.title}
          image="https://cdn.pixabay.com/photo/2019/08/27/22/23/nature-4435423_960_720.jpg"
          content={noticeList.article.content}
        >
        </ArticleBox>
      </Section>
    </Layout>
  );
}

export default Id;
