import React from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/use-i18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from '/utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  RedButton: {
    background: theme.palette.error.main,
    color: 'white',
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getStore = async (context) => {
  return await requestToBackend(context, `api/stores/${context.query.id}/`, 'get', 'json');
};

const deleteStore = async (store) => {
  return await requestToBackend(null, `api/stores/${store.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const { default: lngDict = {} } = await import(`locales/${context.query.lng}.json`);
  const storeResponse = await getStore(context);
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
    props: { lng: context.query.lng, lngDict, selfUser, store: storeResponse.data },
  };
})

function Delete({ lng, lngDict, selfUser, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout title={`${i18n.t('pages.stores.delete.pageTitle')} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={i18n.t('pages.stores.delete.pageTitle')}
      >
        <AlertBox content={i18n.t('pages.stores.delete.warning')} variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteStore(store);
              if (response.status === 204) {
                router.push(`/${lng}/stores/`);
                toast.success(i18n.t('pages.stores.delete.success'));
              }
            }}
          >
            {i18n.t('pages.stores.delete.deleteStore')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            {i18n.t('common.goBack')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Delete;
