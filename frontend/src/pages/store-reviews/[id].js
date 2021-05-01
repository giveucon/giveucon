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

const getStoreReview = async (context) => {
  return await requestToBackend(context, `api/store-reviews/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, storeReview) => {
  return await requestToBackend(context, `api/stores/${storeReview.store.id}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeReviewResponse = await getStoreReview(context);
  const storeResponse = await getStore(context, storeReviewResponse.data);
  console.log(storeReviewResponse.data);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      storeReview: storeReviewResponse.data,
      store: storeResponse.data
    },
  };
})

function Id({ lng, lngDict, selfUser, storeReview, store }) {
  
  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemValueList={selfUser.menuItems}
      title={`${storeReview.review.article.title} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={storeReview.review.article.title}
        padding={false}
      >
        <ReviewBox
          title={storeReview.review.article.title}
          subtitle={new Date(storeReview.review.article.created_at).toLocaleDateString()}
          score={storeReview.review.score}
          imageList={
            storeReview.review.article.images.length > 0
            ? storeReview.review.article.images.map(image => image.image)
            : ['/no_image.png']
          }
          content={storeReview.review.article.content}
        />
      </Section>
      {selfUser.id === store.user && (
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
