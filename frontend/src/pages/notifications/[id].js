import React from 'react';
import { useRouter } from 'next/router'

import * as constants from 'constants';
import Layout from 'components/Layout'
import NoticeBox from 'components/NoticeBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getNotification = async (context) => {
  return await requestToBackend(context, `api/store-notices/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, notification) => {
  return await requestToBackend(context, `api/stores/${notification.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const notificationResponse = await getNotification(context);
  if (notificationResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context, notificationResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      notification: notificationResponse.data,
    }
  }
})

function Id({ lng, lngDict, selfUser, notification }) {
  
const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${notification.article.title} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={notification.article.title}
      >
        <NoticeBox
          title={notification.article.title}
          date={new Date(notification.article.created_at).toLocaleDateString()}
          imageList={
            notification.article.images.length > 0
            ? notification.article.images.map(image => image.image)
            : [constants.NO_IMAGE_PATH]
          }
          content={notification.article.content}
        />
      </Section>
    </Layout>
  );
}

export default Id;
