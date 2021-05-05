import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import * as constants from 'constants';
import Layout from 'components/Layout';
import NoticeBox from 'components/NoticeBox';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getCentralNotice = async (context) => {
  return await requestToBackend(context, `api/central-notices/${context.query.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const centralNoticeResponse = await getCentralNotice(context);
  if (centralNoticeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, centralNotice: centralNoticeResponse.data }
  }
})

function Id({ lng, lngDict, selfUser, centralNotice }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${centralNotice.article.title} - ${i18n.t('_appName')}`}
    >
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
            : [constants.NO_IMAGE_PATH]
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
            {i18n.t('editNotice')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
