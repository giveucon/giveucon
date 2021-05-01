import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import ListItemCard from 'components/ListItemCard';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getProductReviewList = async (context) => {
  return await requestToBackend(context, 'api/product-reviews/', 'get', 'json', null, {
    product: context.query.product,
  });
};

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const initialProductReviewListResponse = await getProductReviewList(context);
  const productResponse = await getProduct(context);
  if (!selfUser.staff && (selfUser.id !== productResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, initialProductReviewListResponse, product: productResponse.data },
  };
})

function List({ lng, lngDict, selfUser, initialProductReviewListResponse, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const [productReviewList, setProductReviewList] = useState(initialProductReviewListResponse.data.results);
  const [productReviewListPagination, setProductReviewListPagination] = useState(1);
  const [hasMoreProductReviewList, setHasMoreProductReviewList] = useState(initialProductReviewListResponse.data.next);

  const getMoreProductReviewList = async () => {
    const productReviewListResponse = await requestToBackend('api/product-reviews/', 'get', 'json', null, {
      product: product.id,
      page: productReviewListPagination + 1,
    });
    setProductReviewList(prevProductReviewList => (prevProductReviewList || []).concat(productReviewListResponse.data.results));
    setProductReviewListPagination(prevProductReviewListPagination => prevProductReviewListPagination + 1);
    if (productReviewListResponse.data.next === null) setHasMoreProductReviewList(prevHasMoreProductReviewList => false);
  }

  return (
    <Layout title={`${i18n.t('reviewList')} - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title={i18n.t('reviewList')}
      >
        {productReviewList && (productReviewList.length > 0) ? (
          <InfiniteScroll
            dataLength={productReviewList.length}
            next={getMoreProductReviewList}
            hasMore={hasMoreProductReviewList}
            loader={<InfiniteScrollLoader loading={true} />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {productReviewList.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <ListItemCard
                    title={item.article.title}
                    subtitle={new Date(item.article.created_at).toLocaleDateString()}
                    onClick={() => router.push(`/product-reviews/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>

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
            pathname: '/product-reviews/create/',
            query: { product: product.id },
          })}
        >
          {i18n.t('addReview')}
        </Button>
      </Box>
    </Layout>
  );
}

export default List;
