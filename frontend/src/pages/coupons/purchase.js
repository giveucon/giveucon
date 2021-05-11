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
import ProductBox from 'components/ProductBox'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  if (productResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      product: productResponse.data
    }
  }
})

function Purchase({ lng, lngDict, selfUser, product }) {

  const i18n = useI18n();
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [amountIcon, setAmountIcon] = useState(<FilterNoneIcon />);

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('purchaseCoupons')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('purchaseCoupons')}
      >
      </Section>
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
              amount <=  0 && setAmountIcon(<FilterNoneIcon />)
              amount === 1 && setAmountIcon(<Filter1Icon />)
              amount === 2 && setAmountIcon(<Filter2Icon />)
              amount === 3 && setAmountIcon(<Filter3Icon />)
              amount === 4 && setAmountIcon(<Filter4Icon />)
              amount === 5 && setAmountIcon(<Filter5Icon />)
              amount === 6 && setAmountIcon(<Filter6Icon />)
              amount === 7 && setAmountIcon(<Filter7Icon />)
              amount === 8 && setAmountIcon(<Filter8Icon />)
              amount === 9 && setAmountIcon(<Filter9Icon />)
              amount >= 10 && setAmountIcon(<Filter9PlusIcon />)
            }}
          />
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/payments/kakao/',
            query: { product: product.id },
          })}
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

export default Purchase;
