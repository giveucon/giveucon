import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import NoticeListItem from 'components/NoticeListItem';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStoreNoticeList = async (context) => {
  return await requestToBackend(context, 'api/store-notices/', 'get', 'json', null, {
    store: context.query.store,
  });
};

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialStoreNoticeListResponse = await getStoreNoticeList(context);
  const storeResponse = await getStore(context);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, initialStoreNoticeListResponse, store: storeResponse.data },
  };
})

function List({ lng, lngDict, selfUser, initialStoreNoticeListResponse, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const [storeNoticeList, setStoreNoticeList] = useState(initialStoreNoticeListResponse.data.results);
  const [storeNoticeListPagination, setStoreNoticeListPagination] = useState(1);
  const [hasMoreStoreNoticeList, setHasMoreStoreNoticeList] = useState(initialStoreNoticeListResponse.data.next);

  const getMoreStoreNoticeList = async () => {
    const storeNoticeListResponse = await requestToBackend('api/store-notices/', 'get', 'json', null, {
      store: store.id,
      page: storeNoticeListPagination + 1,
    });
    setStoreNoticeList(prevStoreNoticeList => (prevStoreNoticeList || []).concat(storeNoticeListResponse.data.results));
    setStoreNoticeListPagination(prevStoreNoticeListPagination => prevStoreNoticeListPagination + 1);
    if (storeNoticeListResponse.data.next === null) setHasMoreStoreNoticeList(prevHasMoreStoreNoticeList => false);
  }

  return (
    <Layout title={`가게 공지사항 목록 - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title='가게 공지사항 목록'
      >
        {storeNoticeList && (storeNoticeList.length > 0) ? (
          <InfiniteScroll
            dataLength={storeNoticeList.length}
            next={getMoreStoreNoticeList}
            hasMore={hasMoreStoreNoticeList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {storeNoticeList.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <NoticeListItem
                    title={item.article.title}
                    subtitle={new Date(item.article.created_at).toLocaleDateString()}
                    onClick={() => router.push(`/store-notices/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>

          </InfiniteScroll>
        ) : (
          <AlertBox content='가게 공지사항이 없습니다.' variant='information' />
        )}
      </Section>
      {(store.user === selfUser.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-notices/create/',
              query: { store: store.id },
            })}
          >
            새 가게 공지사항 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
