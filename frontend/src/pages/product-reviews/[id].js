import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import * as constants from 'constants';
import Layout from 'components/Layout';
import Section from 'components/Section';
import ReviewBox from 'components/ReviewBox';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getProductReview = async (context) => {
  return await requestToBackend(context, `api/product-reviews/${context.query.id}/`, 'get', 'json');
};

const getUser = async (context, productReview) => {
  return await requestToBackend(context, `api/users/${productReview.review.article.user}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productReviewResponse = await getProductReview(context);
  if (productReviewResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const userResponse = await getUser(context, productReviewResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      productReview: productReviewResponse.data,
      user: userResponse.data
    }
  }
})

function Id ({ lng, lngDict, selfUser, productReview, user }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${productReview.review.article.title} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={productReview.review.article.title}
        padding={false}
      >
        <ReviewBox
          title={productReview.review.article.title}
          subtitle={`${user.user_name} | ${new Date(productReview.review.article.created_at).toLocaleDateString()}`}
          score={productReview.review.score}
          imageList={
            productReview.review.article.images.length > 0
            ? productReview.review.article.images.map(image => image.image)
            : [constants.NO_IMAGE_PATH]
          }
          content={productReview.review.article.content}
        />
      </Section>
      {selfUser.id === productReview.review.article.user && (
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
            {i18n.t('editReview')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
