import React from 'react';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getCentralNotice = async (session, context) => {
  return await requestToBackend(session, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const noticeResponse = await getCentralNotice(session, context);
  return {
    props: { session, selfUser, notice: noticeResponse.data },
  };
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
