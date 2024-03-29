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

const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.id}/`, 'get', 'json');

const getStore = async (context, product) => await requestToBackend(context, `api/stores/${product.store}/`, 'get', 'json');

const deleteProduct = async (product) => await requestToBackend(null, `api/products/${product.id}/`, 'delete', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  if (productResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context, productResponse.data);
  if (!selfUser.staff && (selfUser.id !== storeResponse.data.user)){
    return {
      redirect: {
        destination: '/unauthorized/',
        permanent: false
      }
    }
  }
  return {
    props: { lng, lngDict, selfUser, product: productResponse.data }
  }
})

function Delete({ lng, lngDict, selfUser, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('deleteProduct')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('deleteProduct')}
      >
        <AlertBox content={i18n.t('_cannotBeUndoneWarning')} variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteProduct(product);
              if (response.status === 204) {
                router.push(`/stores/${product.store}/`);
                toast.success(i18n.t('_productDeleted'));
              }
            }}
          >
            {i18n.t('deleteProduct')}
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
