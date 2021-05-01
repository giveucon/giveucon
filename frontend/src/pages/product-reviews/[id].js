import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from 'components/Layout'
import Section from 'components/Section'
import ReviewBox from 'components/ReviewBox'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getProductReview = async (context) => {
  return await requestToBackend(context, `api/product-reviews/${context.query.id}/`, 'get', 'json');
};

const getProduct = async (context, productReview) => {
  return await requestToBackend(context, `api/products/${productReview.product.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const productReviewResponse = await getProductReview(context);
  const productResponse = await getProduct(context, productReviewResponse.data);
  console.log(productReviewResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      productReview: productReviewResponse.data,
      product: productResponse.data
    },
  };
})

function Id({ lng, lngDict, selfUser, productReview, product }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout title={`${productReview.review.article.title} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={productReview.review.article.title}
        padding={false}
      >
        <ReviewBox
          title={productReview.review.article.title}
          subtitle={new Date(productReview.review.article.created_at).toLocaleDateString()}
          score={productReview.review.score}
          imageList={
            productReview.review.article.images.length > 0
            ? productReview.review.article.images.map(image => image.image)
            : ['/no_image.png']
          }
          content={productReview.review.article.content}
        />
      </Section>
      {selfUser.id === product.user && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/product-reviews/update/',
              query: { id: productReview.id },
            })}
          >
            상품 리뷰 수정
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
