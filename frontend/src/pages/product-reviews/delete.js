import React from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getProductReview = async (context) => await requestToBackend(context, `api/product-reviews/${context.query.id}/`, 'get', 'json');

const deleteProductReview = async (productReview) => await requestToBackend(null, `api/product-reviews/${productReview.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productReviewResponse = await getProductReview(context);
  if (productReviewResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== productReviewResponse.data.review.article.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, selfUser, productReview: productReviewResponse.data }
  }
})

function Delete({ lng, lngDict, selfUser, productReview }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('deleteReview')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('deleteReview')}
      >
        <AlertBox content={i18n.t('_cannotBeUndoneWarning')} variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteProductReview(productReview);
              if (response.status === 204) {
                router.push(`/products/${productReview.product.id}/`);
                toast.success(i18n.t('_reviewDeleted'));
              }
            }}
          >
            {i18n.t('deleteReview')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            {i18n.t('goBack')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
