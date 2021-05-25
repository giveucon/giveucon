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

const getStoreNotice = async (context) => await requestToBackend(context, `api/store-notices/${context.query.id}/`, 'get', 'json');

const deleteStoreNotice = async (storeNotice) => await requestToBackend(null, `api/store-notices/${storeNotice.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const storeNoticeResponse = await getStoreNotice(context);
  if (storeNoticeResponse.status === 404) {
    return {
      notFound: true
    }
  }
  if (!selfUser.staff && (selfUser.id !== storeNoticeResponse.data.article.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, selfUser, storeNotice: storeNoticeResponse.data }
  }
})

function Delete({ lng, lngDict, selfUser, storeNotice }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('deleteNotice')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('deleteNotice')}
      >
        <AlertBox content={i18n.t('_cannotBeUndoneWarning')} variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteStoreNotice(storeNotice);
              if (response.status === 204) {
                router.push(`/stores/${storeNotice.store}/`);
                toast.success(i18n.t('_noticeDeleted'));
              }
            }}
          >
            {i18n.t('deleteNotice')}
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
