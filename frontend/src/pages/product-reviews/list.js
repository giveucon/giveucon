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

const getProductReviewList = async (context) => await requestToBackend(context, 'api/product-reviews/', 'get', 'json', null, {
    product: context.query.product,
  });

const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const initialProductReviewListResponse = await getProductReviewList(context);
  const productResponse = await getProduct(context);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      initialProductReviewListResponse,
      product: productResponse.data
    }
  }
})

function List({ lng, lngDict, selfUser, initialProductReviewListResponse, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const [productReviewList, setProductReviewList] = useState(initialProductReviewListResponse.data.results);
  const [productReviewListpage, setProductReviewListpage] = useState(1);
  const [hasMoreProductReviewList, setHasMoreProductReviewList] = useState(initialProductReviewListResponse.data.next);

  const getMoreProductReviewList = async () => {
    const productReviewListResponse = await requestToBackend('api/product-reviews/', 'get', 'json', null, {
      product: product.id,
      page: productReviewListpage + 1,
    });
    setProductReviewList(prevProductReviewList => (prevProductReviewList || []).concat(productReviewListResponse.data.results));
    setProductReviewListpage(prevProductReviewListpage => prevProductReviewListpage + 1);
    if (productReviewListResponse.data.next === null) setHasMoreProductReviewList(prevHasMoreProductReviewList => false);
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
        {productReviewList && (productReviewList.length > 0) ? (
          <InfiniteScroll
            dataLength={productReviewList.length}
            next={getMoreProductReviewList}
            hasMore={hasMoreProductReviewList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            {productReviewList.map((item, index) => (
              <>
                <ListItem
                  variant='review'
                  title={item.review.article.title}
                  date={new Date(item.review.article.created_at)}
                  score={item.review.score}
                  onClick={() => router.push(`/product-reviews/${item.id}/`)}
                />
              {index < productReviewList.length - 1 && (<Divider />)}
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
