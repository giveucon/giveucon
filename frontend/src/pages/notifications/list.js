import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Divider from '@material-ui/core/Divider';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import ListItem from 'components/ListItem';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getNotificationList = async (context) => await requestToBackend(context, 'api/notifications/', 'get', 'json', null, {
    store: context.query.store,
  });

const getUser = async (context) => await requestToBackend(context, `api/users/${context.query.to_user}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialNotificationListResponse = await getNotificationList(context);
  const userResponse = await getUser(context);
  return {
    props: { lng, lngDict, selfUser, initialNotificationListResponse, user: userResponse.data }
  }
})

function List({ lng, lngDict, selfUser, initialNotificationListResponse, user }) {

  const i18n = useI18n();
  const router = useRouter();
  const [notificationList, setNotificationList] = useState(initialNotificationListResponse.data.results);
  const [notificationListpage, setNotificationListpage] = useState(1);
  const [hasMoreNotificationList, setHasMoreNotificationList] = useState(initialNotificationListResponse.data.next);

  const getMoreNotificationList = async () => {
    const notificationListResponse = await requestToBackend('api/notifications/', 'get', 'json', null, {
      to_user: user.id,
      page: notificationListpage + 1,
    });
    setNotificationList(prevNotificationList => (prevNotificationList || []).concat(notificationListResponse.data.results));
    setNotificationListpage(prevNotificationListpage => prevNotificationListpage + 1);
    if (notificationListResponse.data.next === null) setHasMoreNotificationList(prevHasMoreNotificationList => false);
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('notificationList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('notificationList')}
      >
        {notificationList && (notificationList.length > 0) ? (
          <InfiniteScroll
            dataLength={notificationList.length}
            next={getMoreNotificationList}
            hasMore={hasMoreNotificationList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            {notificationList.map((item, index) => (
              <>
                <ListItem
                  variant='notification'
                  title={item.article.title}
                  date={item.article.created_at}
                  onClick={() => router.push(`/notifications/${item.id}/`)}
                />
                {index < notificationList.length - 1 && (<Divider />)}
              </>
            ))}
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default List;
