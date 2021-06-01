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

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.coupon_selling}/`, 'get', 'json');

const putCouponSelling = async (couponSelling, status) => await requestToBackend(null, `api/coupon-sellings/${couponSelling.id}/`, 'put', 'json', {
  status: {"status": status}
}, null)

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSelling: couponSellingResponse.data
    }
  }
})

function Index({ lng, lngDict, selfUser, couponSelling }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('tradeRefusal')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('tradeRefusal')}
      >
        <AlertBox content={i18n.t('_areYouSureToRefuseTrade')} variant='question' />
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const putCouponSellingResponse = await putCouponSelling(couponSelling, 'open');
              if (putCouponSellingResponse.status === 200) {
                toast.success(i18n.t('_couponTradeRefused'));
                router.push({
                  pathname: '/coupon-sellings/refuse/completed/',
                  query: { coupon_selling: couponSelling.id },
                });
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
                console.log(putCouponSellingResponse);
              }
            }}
          >
            {i18n.t('refuse')}
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

export default Index;
