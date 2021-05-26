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
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import CouponSellingBox from 'components/CouponSellingBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.id}/`, 'get', 'json', null, {
  used: false
})

const getBuyer = async (context, couponSelling) => await requestToBackend(context, `api/users/${couponSelling.buyer.id}/`, 'get', 'json', null)

const putCouponSelling = async (couponSelling, status) => await requestToBackend(null, `api/coupon-sellings/${couponSelling.id}/`, 'put', 'json', {
  status: {'status': status}
}, null)

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const buyerResponse = couponSellingResponse.data.buyer ? await getBuyer(context, couponSellingResponse.data) : null;
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      couponSelling: couponSellingResponse.data,
      buyer: couponSellingResponse.data.buyer ? buyerResponse.data : null
    }
  }
})

function Id({ lng, lngDict, selfUser, couponSelling, buyer }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('couponTrades')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('couponTrades')}
       />
      <Section
        title={couponSelling.coupon.product.name}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
      >
        <CouponSellingBox
          lng={lng}
          lngDict={lngDict}
          name={couponSelling.coupon.product.name}
          image={couponSelling.coupon.product.images.length > 0 ? couponSelling.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          price={couponSelling.price}
          productPrice={couponSelling.coupon.product.price}
        />
      </Section>


      {(couponSelling.status === 'pre_pending') && (selfUser.id === couponSelling.buyer.id) && (
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
        </Section>
      )}


      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push(`/products/${couponSelling.coupon.product.id}/`)}
        >
          {i18n.t('goToProduct')}
        </Button>
      </Box>

      {(couponSelling.status === 'open') && (selfUser.id !== couponSelling.coupon.user.id) && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/buy/',
              query: { coupon_selling: couponSelling.id },
            })}
          >
            {i18n.t('purchaseCoupons')}
          </Button>
        </Box>
      )}
      {(couponSelling.status === 'open') && (selfUser.id === couponSelling.coupon.user.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/update/',
              query: { id: couponSelling.id },
            })}
          >
            {i18n.t('editCouponTrade')}
          </Button>
        </Box>
      )}
      {(couponSelling.status === 'pre_pending') && (selfUser.id === couponSelling.buyer.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/remit/',
              query: { id: couponSelling.id },
            })}
          >
            {i18n.t('finishRemittance')}
          </Button>
        </Box>
      )}
      {(couponSelling.status === 'pending') && (selfUser.id === couponSelling.coupon.user.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/coupon-sellings/confirm/',
              query: { id: couponSelling.id },
            })}
          >
            {i18n.t('confirmTrade')}
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default Id;
