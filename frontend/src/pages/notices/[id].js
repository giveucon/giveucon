import React from 'react';
import axios from 'axios';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCentralNotice = async (session, context) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/central-notices/${context.query.id}/`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: error.response.status, data: error.response.data }
  }
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const noticeResponse = await getCentralNotice(session, context)
  return {
    props: { session, selfUser, notice: noticeResponse.data },
  }
})

function Id({ session, selfUser, notice }) {
  return (
    <Layout title={`${notice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={notice.article.title}
      >
        <ArticleBox
          title={notice.article.title}
          subtitle={new Date(notice.article.created_at).toLocaleDateString()}
          image='https://cdn.pixabay.com/photo/2015/07/28/20/55/tools-864983_960_720.jpg'
          content={notice.article.content}
        >
        </ArticleBox>
      </Section>
    </Layout>
  );
}

export default Id;
