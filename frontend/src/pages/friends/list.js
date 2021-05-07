import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getFriendList = async (context) => {
  const params = {
    user: context.query.user,
  };
  return await requestToBackend(context, 'api/friends/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
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
    if (friendListResponse.data.next === null) setHasMoreFriendList(prevHasMoreFriendList => false);
  }

  return (
    <Layout
      locale={lng}
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
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container spacing={1}>
              {storeList && storeList.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Tile
                    title={item.name}
                    image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                    onClick={() => router.push(`/users/${item.id}/`)}
                    menuItems={
                      <MenuItem>Menu Item</MenuItem>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default List;
