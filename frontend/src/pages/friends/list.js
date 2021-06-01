import React, { useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';

import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import ListItem from 'components/ListItem';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getFriendList = async (context) => {
  const params = {
    from_user: context.query.from_user,
  };
  return await requestToBackend(context, 'api/friends/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  if (!context.query.from_user) {
    return {
      notFound: true
    }
  }
  const initialFriendListResponse = await getFriendList(context);
  if (initialFriendListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialFriendListResponse,
     }
  }
})

function List({ lng, lngDict, selfUser, initialFriendListResponse }) {

  const i18n = useI18n();
  const router = useRouter();
  const [friendList, setFriendList] = useState(initialFriendListResponse.data.results);
  const [friendListpage, setFriendListpage] = useState(1);
  const [hasMoreFriendList, setHasMoreFriendList] = useState(initialFriendListResponse.data.next);

  const getMoreFriendList = async () => {
    const params = {
      user: router.query.user,
      page: friendListpage + 1,
    };
    const friendListResponse = await requestToBackend(null, 'api/friends/', 'get', 'json', null, params);
    setFriendList(prevFriendList => prevFriendList.concat(friendListResponse.data.results));
    setFriendListpage(prevFriendListpage => prevFriendListpage + 1);
    if (friendListResponse.data.next === null) setHasMoreFriendList(false);
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('friendList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('friendList')}
      >
        {(friendList.length > 0) ? (
          <InfiniteScroll
            dataLength={friendList.length}
            next={getMoreFriendList}
            hasMore={hasMoreFriendList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            {friendList && friendList.map((item) => (
              <ListItem
                key={item.id}
                variant='user'
                title={item.to_user.user_name}
                image={gravatar.url(item.to_user.email, {default: 'identicon'})}
                onClick={() => router.push(`/users/${item.to_user.id}/`)}
              />
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
