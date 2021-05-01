import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from 'components/Layout'
import NoticeBox from 'components/NoticeBox'
import Section from 'components/Section'
import useI18n from 'hooks/use-i18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCentralNotice = async (context) => {
  return await requestToBackend(context, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const centralNoticeResponse = await getCentralNotice(context);
  return {
    props: { lng, lngDict, selfUser, centralNotice: centralNoticeResponse.data },
  };
})

function Id({ lng, lngDict, selfUser, centralNotice }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout title={`${centralNotice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={centralNotice.article.title}
      >
        <NoticeBox
          title={centralNotice.article.title}
          subtitle={new Date(centralNotice.article.created_at).toLocaleDateString()}
          imageList={
            centralNotice.article.images.length > 0
            ? centralNotice.article.images.map(image => image.image)
            : ['/no_image.png']
          }
          content={centralNotice.article.content}
        />
      </Section>
      {selfUser.staff && (
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
