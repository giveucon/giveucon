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

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.id}`, 'get', 'json');
};

const deleteCoupon = async (coupon) => {
  return await requestToBackend(null, `api/coupons/${coupon.id}/`, 'delete', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (!selfUser.staff && (selfUser.id !== couponResponse.data.user)){
    return {
      redirect: {
        permanent: false,
        destination: "/unauthorized/"
      }
    };
  }
  return {
    props: { lng, lngDict, selfUser, coupon: couponResponse.data },
  };
})

function Delete({ lng, lngDict, selfUser, coupon }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('deleteCoupon')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('deleteCoupon')}
      >
        <AlertBox content={i18n.t('_cannotBeUndoneWarning')} variant='warning' />
        <Box marginY={1}>
          <Button
            className={classes.RedButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await deleteCoupon(coupon);
              if (response.status === 204) {
                router.push(`/coupons/`);
                toast.success(i18n.t('_couponSuccessfullyDeleted'));
              }
            }}
          >
            가게 삭제
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
