import React from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import Layout from 'components/Layout'
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
  kakaoButton: {
    background: theme.palette.kakao.main,
    color: theme.palette.kakao.contrastText,
    '&:hover': {
       background: theme.palette.kakao.dark,
    },
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
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <Box className={classes.imageArea}>
            <Card>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={product.images.length > 0 ? product.images[0].image : constants.NO_IMAGE_PATH}
                  title={product.name}
                />
              </CardActionArea>
            </Card>
          </Box>
          <Box margin='1rem'>
            <Box marginBottom='0.5rem'>
              <Typography variant='h5'>{product.name}</Typography>
            </Box>
            <Divider />
            <Box marginTop='0.5rem'>
              <Typography variant='h6'>{product.price.toLocaleString('ko-KR') + '원'}</Typography>
            </Box>
          </Box>
        </Box>
      </Section>

      <Box marginY={1}>
        <Button
          // color='primary'
          className={classes.kakaoButton}
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
