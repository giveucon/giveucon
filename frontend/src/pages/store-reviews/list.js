import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import ListItemCard from 'components/ListItemCard';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getStoreReviewList = async (context) => {
  return await requestToBackend(context, 'api/store-reviews/', 'get', 'json', null, {
    store: context.query.store,
  });
};

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialStoreReviewListResponse = await getStoreReviewList(context);
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
    props: { lng, lngDict, selfUser, initialStoreReviewListResponse, store: storeResponse.data },
  };
})

function List({ lng, lngDict, selfUser, initialStoreReviewListResponse, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const [storeReviewList, setStoreReviewList] = useState(initialStoreReviewListResponse.data.results);
  const [storeReviewListpage, setStoreReviewListpage] = useState(0);
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
      locale={lng}
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
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {storeReviewList.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <ListItemCard
                    title={item.article.title}
                    subtitle={new Date(item.article.created_at).toLocaleDateString()}
                    onClick={() => router.push(`/store-reviews/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>

          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
      {(store.user === selfUser.id) && (
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
      )}
    </Layout>
  );
}

export default List;