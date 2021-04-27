import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import ArticleBox from '../../components/ArticleBox'
import requestToBackend from '../../utils/requestToBackend'
import withAuthServerSideProps from '../../utils/withAuthServerSideProps'

const getCentralNotice = async (context) => {
  return await requestToBackend(context, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const centralNoticeResponse = await getCentralNotice(context);
  return {
    props: { selfUser, centralNotice: centralNoticeResponse.data },
  };
})

function Id({ selfUser, centralNotice }) {
  const router = useRouter();
  return (
    <Layout title={`${centralNotice ? centralNotice.article.title : '로딩중'} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={centralNotice ? centralNotice.article.title : '로딩중'}
      >
        {centralNotice && (
          <ArticleBox
            title={centralNotice.article.title}
            subtitle={new Date(centralNotice.article.created_at).toLocaleDateString()}
            image={
              centralNotice.article.images.length > 0
              ? centralNotice.article.images[0].image
              : '/no_image.png'
            }
            content={centralNotice.article.content}
          >
        </ArticleBox>
        )}
        {!centralNotice && (
          <ArticleBox skeleton/>
        )}
      </Section>
      {selfUser && selfUser.staff && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/central-notices/update/',
              query: { id: centralNotice.id },
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
