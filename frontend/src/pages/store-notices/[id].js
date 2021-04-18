import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const getStoreNotice = async (session, context) => {
  return await requestToBackend(session, `api/store-notices/${context.query.id}/`, 'get', 'json');
};

const getStore = async (session, storeNotice) => {
  return await requestToBackend(session, `api/stores/${storeNotice.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const storeNoticeResponse = await getStoreNotice(session, context);
  const storeResponse = await getStore(session, storeNoticeResponse.data);
  return {
    props: { session, selfUser, storeNotice: storeNoticeResponse.data, store: storeResponse.data },
  };
})

function Id({ session, selfUser, storeNotice, store }) {
  const router = useRouter();
  return (
    <Layout title={`${storeNotice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={storeNotice.article.title}
      >
        <ArticleBox
          title={storeNotice.article.title}
          subtitle={new Date(storeNotice.article.created_at).toLocaleDateString()}
          image={
            storeNotice.article.images.length > 0
            ? storeNotice.article.images[0].image
            : '/no_image.png'
          }
          content={storeNotice.article.content}
        >
        </ArticleBox>
      </Section>
      {selfUser.id === store.user && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-notices/update/',
              query: { id: storeNotice.id },
            })}
          >
            공지사항 수정
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
