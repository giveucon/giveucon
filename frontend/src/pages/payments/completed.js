import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';

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

const getCoupon = async (context) => {
  return await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  return {
    props: { lng, lngDict, selfUser, coupon: couponResponse.data },
  };
})

function Completed({ lng, lngDict, selfUser, coupon }) {

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
        title={i18n.t('_couponSuccessfullyIssued')}
        titlePrefix={<IconButton><CheckIcon /></IconButton>}
      >
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <Box className={classes.imageArea}>
            <Card>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
                  title={coupon.product.name}
                />
              </CardActionArea>
            </Card>
          </Box>
          <Box margin='1rem'>
            <Box marginBottom='0.5rem'>
              <Typography variant='h5'>{coupon.product.name}</Typography>
            </Box>
            <Divider />
            <Box marginTop='0.5rem'>
              <Typography variant='h6'>{coupon.product.price.toLocaleString('ko-KR') + '원'}</Typography>
            </Box>
          </Box>
        </Box>
      </Section>
      {(true) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/coupons/${coupon.id}`)}
          >
            {i18n.t('goToCoupon')}
          </Button>
        </Box>
      )}
      <Box marginY={1}>
        <Button
          color='default'
          fullWidth
          variant='contained'
          onClick={() => router.push('/home/')}
        >
          {i18n.t('goHome')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Completed;
