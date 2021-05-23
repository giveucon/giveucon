import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/styles';
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import AmountInputBox from 'components/AmountInputBox'
import Layout from 'components/Layout'
import ProductBox from 'components/ProductBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  imageArea: {
    height: '10rem',
    width: '10rem',
    position: 'relative',
  },
  media: {
    height: '10rem',
    width: '10rem',
  },
}));

const getProduct = async (context) => await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');

const postCoupon = async (amount, product) => {
  const data = {
    count: amount,
    coupon: {
      price: product.price,
      product: product.id
    }
  };
  return await requestToBackend(null, `api/coupons/`, 'post', 'json', data, null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  if (productResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: { lng, lngDict, selfUser, product: productResponse.data }
  }
})

function Index({ lng, lngDict, selfUser, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [amount, setAmount] = useState(0);
  const [amountIcon, setAmountIcon] = useState(<FilterNoneIcon />);

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('issueCoupon')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('issueCoupon')}
       />
      <Section
        title={i18n.t('paymentInfo')}
        titlePrefix={<IconButton><PaymentIcon /></IconButton>}
      >
        <ProductBox
          name={product.name}
          price={product.price}
          image={product.images.length > 0 ? product.images[0].image : constants.NO_IMAGE_PATH}
          lng={lng}
          lngDict={lngDict}
        />
      </Section>
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

      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const postCouponResponse = await postCoupon(amount, product);
            if (postCouponResponse.status === 201) {
              router.push({
                pathname: '/coupons/issue/completed/',
                query: { product: product.id },
              });
              toast.success(i18n.t('_couponSuccessfullyIssued'));
            } else {
              toast.success(i18n.t('_errorOccurredProcessingRequest'));
            }
          }}
        >
          {i18n.t('issueCoupon')}
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

export default Index;
