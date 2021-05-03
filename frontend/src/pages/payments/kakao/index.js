import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import PaymentIcon from '@material-ui/icons/Payment';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  background: {
    height: '75vh',
  },
}));

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

const postCoupon = async (selfUser, product) => {
  const data = {
    used: false,
    user: selfUser.id,
    product: product.id,
  };
  return await requestToBackend(null, `api/coupons/`, 'post', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  return {
    props: { lng, lngDict, selfUser, product: productResponse.data },
  };
})

function Index({ lng, lngDict, selfUser, product }) {
  
  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    async function dummyPayment() {
      await new Promise(r => setTimeout(r, 3000));
      const response = await postCoupon(selfUser, product);
      if (response.status === 201) {
        router.push({
          pathname: '/payments/completed/',
          query: { coupon: response.data.id },
        });
        toast.success(i18n.t('_couponSuccessfullyIssued'));
      }
    }
    dummyPayment();
  }, []);

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('paymentOnProgress')} - ${i18n.t('_appName')}`}
    >
      <Section
        title={i18n.t('paymentOnProgress')}
        titlePrefix={<IconButton><PaymentIcon /></IconButton>}
      />
      <Box
        className={classes.background}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Box style={{ minHeight: '8rem', minWidth: '16rem' }}>
          <Box margin='2rem'>
            <LinearProgress />
          </Box>
          <Typography align='center'>{i18n.t('_holdOnAMomentPlease')}</Typography>
        </Box>
      </Box>
    </Layout>
  );
}

export default Index;
