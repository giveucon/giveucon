import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import requestToBackend from '../functions/requestToBackend'
import withAuthServerSideProps from '../functions/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getStoreNotice = async (session, context) => {
  return await requestToBackend(session, `api/store-notices/${context.query.id}/`, 'get', 'json');
};

const getStore = async (session, StoreNotice) => {
  return await requestToBackend(session, `api/stores/${StoreNotice.store}/`, 'get', 'json');
};

const deleteStoreNotice = async (session, storeNotice) => {
  return await requestToBackend(session, `api/store-notices/${storeNotice.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const storeNoticeResponse = await getStoreNotice(session, context);
  const storeResponse = await getStore(session, storeNoticeResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized/',
      },
      props: {}
    }
  }
  return {
    props: { session, selfUser, storeNotice: storeNoticeResponse.data },
  };
})

function Delete({ session, selfUser, storeNotice }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Layout title={`가게 공지사항 삭제 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 삭제'
      >
        <AlertBox content='경고: 이 작업 후에는 되돌릴 수 없습니다.' variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteStoreNotice(session, storeNotice);
              if (response.status === 204) {
                router.push(`/stores/${storeNotice.store}/`);
                toast.success('가게 공지사항이 삭제되었습니다.');
              }
            }}
          >
            가게 공지사항 삭제
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
