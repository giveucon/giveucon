import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import * as constants from 'constants';
import Layout from 'components/Layout'
import NoticeBox from 'components/NoticeBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStoreNotice = async (context) => await requestToBackend(context, `api/store-notices/${context.query.id}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeNoticeResponse = await getStoreNotice(context);
  if (storeNoticeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeNotice: storeNoticeResponse.data,
    }
  }
})

function Id({ lng, lngDict, selfUser, storeNotice }) {

const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${storeNotice.article.title} - ${i18n.t('_appName')}`}
    >
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
            : [constants.NO_IMAGE_PATH]
          }
          content={storeNotice.article.content}
        />
      </Section>


      {selfUser.id === storeNotice.article.user && (
        <Section
          title={i18n.t('managements')}
          titlePrefix={<IconButton><SettingsIcon /></IconButton>}
        >
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
              {i18n.t('editNotice')}
            </Button>
          </Box>
        </Section>
      )}
    </Layout>
  );
}

export default Id;
