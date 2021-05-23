import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import Filter4Icon from '@material-ui/icons/Filter4';
import Filter5Icon from '@material-ui/icons/Filter5';
import Filter6Icon from '@material-ui/icons/Filter6';
import Filter7Icon from '@material-ui/icons/Filter7';
import Filter8Icon from '@material-ui/icons/Filter8';
import Filter9Icon from '@material-ui/icons/Filter9';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus';
import IconButton from '@material-ui/core/IconButton';
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import AmountInputBox from 'components/AmountInputBox'
import Layout from 'components/Layout'
import PayPalButton from 'components/PayPalButton'
import CouponBox from 'components/CouponBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json');

const putCouponBuy = async (coupon) => {
  return await requestToBackend(null, `api/coupons/${coupon.id}/buy/`, 'put', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (couponResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data
    }
  }
})

function Buy({ lng, lngDict, selfUser, coupon }) {

  const i18n = useI18n();
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [amountIcon, setAmountIcon] = useState(<FilterNoneIcon />);

  const merchantId = 'AAAAAAAAAAAA';

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('purchaseCoupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('purchaseCoupons')}
       />
      <Section
        title={i18n.t('paymentInfo')}
        titlePrefix={<IconButton><PaymentIcon /></IconButton>}
      >
        <CouponBox
          name={coupon.product.name}
          price={coupon.product.price}
          image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          lng={lng}
          lngDict={lngDict}
        />
      </Section>

      {/*
        <Section
          title={i18n.t('amount')}
          titlePrefix={<IconButton>{amountIcon}</IconButton>}
        >
          <Box paddingY={1}>
            <AmountInputBox
              label={i18n.t('amount')}
              lng={lng}
              lngDict={lngDict}
              defaultAmount={0}
              addAmountList={constants.AMOUNT_LIST}
              onChangeAmount={(amount) => {
                setAmount(prevAmount => amount);
                if (amount <= 0)  setAmountIcon(<FilterNoneIcon />)
                if (amount === 1) setAmountIcon(<Filter1Icon />)
                if (amount === 2) setAmountIcon(<Filter2Icon />)
                if (amount === 3) setAmountIcon(<Filter3Icon />)
                if (amount === 4) setAmountIcon(<Filter4Icon />)
                if (amount === 5) setAmountIcon(<Filter5Icon />)
                if (amount === 6) setAmountIcon(<Filter6Icon />)
                if (amount === 7) setAmountIcon(<Filter7Icon />)
                if (amount === 8) setAmountIcon(<Filter8Icon />)
                if (amount === 9) setAmountIcon(<Filter9Icon />)
                if (amount >= 10) setAmountIcon(<Filter9PlusIcon />)
              }}
            />
          </Box>
        </Section>
      */}
      
      {/*
        <PayPalButton merchantId={merchantId} price='0.01' description='test' />
      */}

      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const putCouponBuyResponse = await putCouponBuy(coupon);
            if (putCouponBuyResponse.status === 201) {
              router.push(`/coupons/${putCouponBuyResponse.data.id}/`);
              toast.success(i18n.t('_couponSuccessfullyPurchased'));
            }
            else {
              toast.error(i18n.t('_errorOccurredProcessingRequest'));
            }
          }}
        >
          {i18n.t('purchaseCoupon')}
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.back()}
        >
          {i18n.t('goBack')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Buy;
