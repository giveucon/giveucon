import React from 'react';
import { useRouter } from 'next/router'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.coupon_selling}/`, 'get', 'json');

const getBuyer = async (context, couponSelling) => await requestToBackend(context, `api/users/${couponSelling.buyer.id}`, 'get', 'json', null)

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const buyerResponse = await getBuyer(context, couponSellingResponse.data);
  if (buyerResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSelling: couponSellingResponse.data,
      buyer: buyerResponse.data
    }
  }
})

function Completed({ lng, lngDict, selfUser, couponSelling, buyer }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('tradeRequested')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('tradeRequested')}
      >
        <AlertBox content={i18n.t('_couponTradeRequested')} variant='success' />
      </Section>

      
      <Section
        title={i18n.t('remittance')}
        titlePrefix={<IconButton><LocalAtmIcon /></IconButton>}
      >
        <Box padding='1rem'>
          <Typography align='center' variant='body2'>{i18n.t('bitcoin')}</Typography>
          <Typography align='center' variant='h6'>{`${couponSelling.price / 100000000}${i18n.t('_currencyBTC')}`}</Typography>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Typography align='center' variant='body2'>{buyer.wallet}</Typography>
            <CopyToClipboard
              text={buyer.wallet}
              onCopy={() => toast.success(i18n.t('_copiedToClipboard'))}
            >
              <IconButton><AssignmentIcon /></IconButton>
            </CopyToClipboard>
          </Box>
        </Box>
        <Typography variant='body1'>{i18n.t('_sendCryptocurrencyToWallet')}</Typography>
        <Typography variant='body1'>{i18n.t('_pressButtonAfterSendingCryptocurrency')}</Typography>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/remit/',
              query: { coupon_selling: couponSelling.id },
            })}
          >
            {i18n.t('remittanceCompleted')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.back()}}
          >
            {i18n.t('goBack')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => {router.push(`/products/${couponSelling.coupon.product.id}/`)}}
          >
            {i18n.t('goToProduct')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/')}
          >
            {i18n.t('goHome')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Completed;
