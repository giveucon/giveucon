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
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
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

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const storeReviewResponse = await getStoreReview(context);
  const storeResponse = await getStore(context, storeReviewResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, storeReview: storeReviewResponse.data },
  };
})

function Delete({ lng, lngDict, selfUser, storeReview }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout title={`가게 리뷰 삭제 - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title='가게 리뷰 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteStoreReview(storeReview);
              if (response.status === 204) {
                router.push(`/stores/${storeReview.store.id}/`);
                toast.success('가게 리뷰가 삭제되었습니다.');
              }
            }}
          >
            가게 리뷰 삭제
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            뒤로가기
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
