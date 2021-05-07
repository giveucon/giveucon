import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@material-ui/core/Grid';

import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import NoticeListItem from 'components/NoticeListItem';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getCentralNoticeList = async (context) => {
  return await requestToBackend(context, 'api/central-notices/', 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialCentralNoticeListResponse = await getCentralNoticeList(context);
  return {
    props: { lng, lngDict, selfUser, initialCentralNoticeListResponse }
  }
})

function List({ lng, lngDict, selfUser, initialCentralNoticeListResponse }) {

  const i18n = useI18n();
  const router = useRouter();
  const [centralNoticeList, setCentralNoticeList] = useState(initialCentralNoticeListResponse.data.results);
  const [centralNoticeListpage, setCentralNoticeListpage] = useState(1);
  const [hasMoreCentralNoticeList, setHasMoreCentralNoticeList] = useState(initialCentralNoticeListResponse.data.next);

  const getMoreCentralNoticeList = async () => {
    const centralNoticeListResponse = await requestToBackend(null, 'api/central-notices/', 'get', 'json', null, {
      page: centralNoticeListpage + 1,
    });
    setCentralNoticeList(prevCentralNoticeList => (prevCentralNoticeList || []).concat(centralNoticeListResponse.data.results));
    setCentralNoticeListpage(prevCentralNoticeListpage => prevCentralNoticeListpage + 1);
    if (centralNoticeListResponse.data.next === null) setHasMoreCentralNoticeList(prevHasMoreCentralNoticeList => false);
  }

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('noticeList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('noticeList')}
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
    </Layout>
  );
}

export default List;
