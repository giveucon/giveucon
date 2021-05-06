import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import * as constants from 'constants';
import Layout from 'components/Layout';
import Section from 'components/Section';
import ReviewBox from 'components/ReviewBox';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getStoreReview = async (context) => {
  return await requestToBackend(context, `api/store-reviews/${context.query.id}/`, 'get', 'json');
};

const getUser = async (context, storeReview) => {
  return await requestToBackend(context, `api/users/${storeReview.review.article.user}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeReviewResponse = await getStoreReview(context);
  if (storeReviewResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const userResponse = await getUser(context, storeReviewResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeReview: storeReviewResponse.data,
      user: userResponse.data
    }
  }
})

function Id({ lng, lngDict, selfUser, storeReview, user }) {
  
  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${storeReview.review.article.title} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={storeReview.review.article.title}
        padding={false}
      >
        <ReviewBox
          title={storeReview.review.article.title}
          subtitle={`${user.user_name} | ${new Date(storeReview.review.article.created_at).toLocaleDateString()}`}
          score={storeReview.review.score}
          imageList={
            storeReview.review.article.images.length > 0
            ? storeReview.review.article.images.map(image => image.image)
            : [constants.NO_IMAGE_PATH]
          }
          content={storeReview.review.article.content}
        />
      </Section>
      {selfUser.id === storeReview.review.article.user && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-reviews/update/',
              query: { id: storeReview.id },
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
