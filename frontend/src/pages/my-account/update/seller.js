import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'
import PayPalSVGIcon from '../../../../public/paypal.svg';

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
  paypalButton: {
    background: theme.palette.paypal.main,
    color: theme.palette.paypal.contrastText,
    '&:hover': {
       background: theme.palette.paypal.dark,
    },
  },
}));

const getSellerOnboardLink = async () => await requestToBackend(null, '/api/seller-onboard-link/', 'get', 'json');

const getSellerOnboardStatus = async () => await requestToBackend(null, '/api/seller-onboard-status/', 'get', 'json');

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: { lng, lngDict, selfUser }
  }))

function Seller({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={prevSelfUser.menu_items}
      title={`${i18n.t('seller')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('seller')}
      />
      <Section
        title={i18n.t('paypalAccount')}
        titlePrefix={
          <IconButton>
            <SvgIcon>
              <PayPalSVGIcon/>
            </SvgIcon>
          </IconButton>
        }
      >
        <Box marginY={1}>
          <Button
            className={classes.paypalButton}
            fullWidth
            variant='contained'
            onClick={async () => {
              const GetOnboardSellerResponse = await getSellerOnboardLink();
              if (GetOnboardSellerResponse.status === 200) {
                router.push(GetOnboardSellerResponse.data.onboard_link);
              } else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('linkWithPayPalAccount')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            fullWidth
            variant='contained'
            onClick={async () => await getSellerOnboardStatus()}
          >
            Get Seller Onboard Status
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Seller;
