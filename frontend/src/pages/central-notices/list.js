import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Divider from '@material-ui/core/Divider';

import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import ListItem from 'components/ListItem';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getCentralNoticeList = async (context) => await requestToBackend(context, 'api/central-notices/', 'get', 'json');

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
      lng={lng}
      lngDict={lngDict}
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
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            {centralNoticeList.map((item, index) => (
              <>
                <ListItem
                  variant='notice'
                  title={item.article.title}
                  subtitle={item.article.created_at}
                  onClick={() => router.push(`/central-notices/${item.id}/`)}
                />
              {index < centralNoticeList.length - 1 && (<Divider />)}
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
