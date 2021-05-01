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

const getStoreNotice = async (context) => {
  return await requestToBackend(context, `api/store-notices/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, storeNotice) => {
  return await requestToBackend(context, `api/stores/${storeNotice.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeNoticeResponse = await getStoreNotice(context);
  const storeResponse = await getStore(context, storeNoticeResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeNotice: storeNoticeResponse.data,
      store: storeResponse.data
    },
  };
})

function Id({ lng, lngDict, selfUser, storeNotice, store }) {
  
const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout title={`${storeNotice.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={storeNotice.article.title}
      >
        <NoticeBox
          title={storeNotice.article.title}
          subtitle={new Date(storeNotice.article.created_at).toLocaleDateString()}
          imageList={
            storeNotice.article.images.length > 0
            ? storeNotice.article.images.map(image => image.image)
            : ['/no_image.png']
          }
          content={storeNotice.article.content}
        />
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
            가게 공지사항 수정
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
