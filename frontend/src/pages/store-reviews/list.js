import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import ListItem from 'components/ListItem';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStoreReviewList = async (context) => await requestToBackend(context, 'api/store-reviews/', 'get', 'json', null, {
    store: context.query.store,
  });

const getStore = async (context) => await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialStoreReviewListResponse = await getStoreReviewList(context);
  if (initialStoreReviewListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialStoreReviewListResponse,
      store: storeResponse.data
    }
  }
})

function List({ lng, lngDict, selfUser, initialStoreReviewListResponse, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const [storeReviewList, setStoreReviewList] = useState(initialStoreReviewListResponse.data.results);
  const [storeReviewListpage, setStoreReviewListpage] = useState(1);
  const [hasMoreStoreReviewList, setHasMoreStoreReviewList] = useState(initialStoreReviewListResponse.data.next);

  const getMoreStoreReviewList = async () => {
    const storeReviewListResponse = await requestToBackend('api/store-reviews/', 'get', 'json', null, {
      store: store.id,
      page: storeReviewListpage + 1,
    });
    setStoreReviewList(prevStoreReviewList => (prevStoreReviewList || []).concat(storeReviewListResponse.data.results));
    setStoreReviewListpage(prevStoreReviewListpage => prevStoreReviewListpage + 1);
    if (storeReviewListResponse.data.next === null) setHasMoreStoreReviewList(prevHasMoreStoreReviewList => false);
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('reviewList')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('reviewList')}
      >
        {storeReviewList && (storeReviewList.length > 0) ? (
          <InfiniteScroll
            dataLength={storeReviewList.length}
            next={getMoreStoreReviewList}
            hasMore={hasMoreStoreReviewList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            {storeReviewList.map((item) => (
              <>
                <ListItem
                  variant='review'
                  title={item.review.article.title}
                  date={new Date(item.review.article.created_at)}
                  score={item.review.score}
                  onClick={() => router.push(`/store-reviews/${item.id}/`)}
                />
              {index < storeReviewList.length - 1 && (<Divider />)}
              </>
            ))}
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/store-reviews/create/',
            query: { store: store.id },
          })}
        >
          {i18n.t('addReview')}
        </Button>
      </Box>
    </Layout>
  );
}

export default List;
