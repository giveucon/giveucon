import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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

const getProduct = async (context) => {
  return await requestToBackend(context, `api/products/${context.query.product}/`, 'get', 'json');
};

const getStore = async (context, product) => {
  return await requestToBackend(context, `api/stores/${product.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const productResponse = await getProduct(context);
  if (productResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeResponse = await getStore(context, productResponse.data);
  return {
    props: { lng, lngDict, selfUser, product: productResponse.data, store: storeResponse.data }
  }
})

function Issue({ lng, lngDict, selfUser, product, store }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [amount, setAmount] = useState(1);
  const [infinite, setInfinite] = useState(false);
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('issueCoupon')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('issueCoupon')}
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
        title={i18n.t('paymentInfo')}
        titlePrefix={<IconButton><PaymentIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <AmountInputBox
            label={i18n.t('amount')}
            lng={lng}
            lngDict={lngDict}
            addAmountList={constants.AMOUNT_LIST}
            enableInfinite
            onChangeAmount={(amount) => {
              setAmount(prevAmount => amount);
            }}
            onChangeInfinite={(infinite) => {
              setInfinite(prevInfinite => infinite);
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

export default Issue;
