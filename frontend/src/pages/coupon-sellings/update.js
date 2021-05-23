import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertCommentIcon from '@material-ui/icons/InsertComment';

import * as constants from 'constants';
import AmountInputBox from 'components/AmountInputBox'
import CouponSellingBox from 'components/CouponSellingBox'
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

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.id}/`, 'get', 'json');

const putCouponSelling = async (couponSelling) => await requestToBackend(null, 'api/coupon-sellings/', 'post', 'json', couponSelling, null);

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng, lngDict, selfUser, couponSelling: couponSellingResponse.data
    }
  }
})

function Update ({ lng, lngDict, selfUser, couponSelling: prevCouponSelling }) {
  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [couponSelling, setCouponSelling] = useState({
    ...prevCouponSelling
  });

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('editCouponTrade')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('editCouponTrade')}
       />
      <Section
        title={i18n.t('couponTrade')}
        titlePrefix={<IconButton><InsertCommentIcon /></IconButton>}
      >
        <CouponSellingBox
          lng={lng}
          lngDict={lngDict}
          name={prevCouponSelling.coupon.product.name}
          image={prevCouponSelling.coupon.product.images.length > 0 ? prevCouponSelling.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
          productPrice={prevCouponSelling.coupon.product.price}
          price={prevCouponSelling.price}
        />
      </Section>
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <AmountInputBox
            variant='money'
            defaultAmount={prevCouponSelling.price}
            label={i18n.t('price')}
            lng={lng}
            lngDict={lngDict}
            addAmountList={constants.MONEY_DISCOUNT_LIST}
            onChangeAmount={(amount) => {
              setCouponSelling(prevCouponSelling => ({ ...prevCouponSelling, price: amount }));
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
            const putCouponSellingResponse = await putCouponSelling(couponSelling);
            if (putCouponSellingResponse.status === 201) {
              router.push(`/coupon-sellings/${putCouponSellingResponse.data.id}/`);
              toast.success(i18n.t('_couponTradeSuccessfullyEdited'));
            }
            else {
              toast.error(i18n.t('_errorOccurredProcessingRequest'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
      <Box marginY={1}>
        <Button
          className={classes.errorButton}
          fullWidth
          variant='contained'
          onClick={() => router.push({
            pathname: '/coupon-sellings/delete/',
            query: { id: couponSelling.id },
          })}
        >
          {i18n.t('deleteCouponTrade')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Update;
