import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ChatIcon from '@material-ui/icons/Chat';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import NoticeListItem from 'components/NoticeListItem';
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCentralNoticeList = async (context) => {
  return await requestToBackend(context, 'api/central-notices/', 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialCentralNoticeListResponse = await getCentralNoticeList(context);
  return {
    props: { lng, lngDict, selfUser, initialCentralNoticeListResponse },
  };
})

function List({ lng, lngDict, selfUser, initialCentralNoticeListResponse }) {

  const i18n = useI18n();
  const router = useRouter();
  const [centralNoticeList, setCentralNoticeList] = useState(initialCentralNoticeListResponse.data.results);
  const [centralNoticeListPagination, setCentralNoticeListPagination] = useState(1);
  const [hasMoreCentralNoticeList, setHasMoreCentralNoticeList] = useState(initialCentralNoticeListResponse.data.next);

  const getMoreCentralNoticeList = async () => {
    const centralNoticeListResponse = await requestToBackend('api/central-notices/', 'get', 'json', null, {
      page: centralNoticeListPagination + 1,
    });
    setCentralNoticeList(prevCentralNoticeList => (prevCentralNoticeList || []).concat(centralNoticeListResponse.data.results));
    setCentralNoticeListPagination(prevCentralNoticeListPagination => prevCentralNoticeListPagination + 1);
    if (centralNoticeListResponse.data.next === null) setHasMoreCentralNoticeList(prevHasMoreCentralNoticeList => false);
  }

  return (
    <Layout
      locale={lng}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('notices')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('notices')}
      />
      <Section
        titlePrefix={<IconButton><AnnouncementIcon /></IconButton>}
        title={i18n.t('newNotices')}
        padding={false}
      >
        {(centralNoticeList.length > 0) ? (
          <SwipeableTileList autoplay={true}>
            {centralNoticeList.slice(0, 2).map((item, index) => {
              return <Tile
                key={index}
                title={item.article.title}
                image={
                  item.images && (item.images.length > 0)
                  ? item.images[0].image
                  : '/no_image.png'
                }
                onClick={() => router.push(`/central-notices/${item.id}`)}
              />
            })}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>

      <Section
        title={i18n.t('allNotices')}
        titlePrefix={<IconButton><ChatIcon /></IconButton>}
      >
        {(centralNoticeList.length > 0) ? (
          <InfiniteScroll
            dataLength={centralNoticeList.length}
            next={getMoreCentralNoticeList}
            hasMore={hasMoreCentralNoticeList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {centralNoticeList.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <NoticeListItem
                    title={item.article.title}
                    subtitle={new Date(item.article.created_at).toLocaleDateString()}
                    onClick={() => router.push(`/central-notices/${item.id}/`)}
                  />
                </Grid>
              ))}
              </Grid>
            </InfiniteScroll>
          ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>

      {selfUser && selfUser.staff && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/central-notices/create/`)}
          >
            {i18n.t('addNotice')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
