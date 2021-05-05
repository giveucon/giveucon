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

const getStoreReview = async (context) => {
  return await requestToBackend(context, `api/store-reviews/${context.query.id}/`, 'get', 'json');
};

const getStore = async (context, StoreReview) => {
  return await requestToBackend(context, `api/stores/${StoreReview.store}/`, 'get', 'json');
};

const deleteStoreReview = async (storeReview) => {
  return await requestToBackend(null, `api/store-reviews/${storeReview.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, darkMode, selfUser) => {
  const storeReviewResponse = await getStoreReview(context);
  if (storeReviewResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context, storeReviewResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, darkMode, selfUser, storeReview: storeReviewResponse.data }
  }
})

function Delete({ lng, lngDict, darkMode, selfUser, storeReview }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      locale={lng}
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
              const response = await deleteStoreReview(storeReview);
              if (response.status === 204) {
                router.push(`/stores/${storeReview.store.id}/`);
                toast.success(i18n.t('_reviewSuccessfullyDeleted'));
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
