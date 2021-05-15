import React, { useEffect, useState } from 'react';
import { PhoneNumberUtil, PhoneNumberFormat as PNF } from 'google-libphonenumber';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Phone';

import * as constants from 'constants';
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

const putSelfUser = async (selfUser, phoneUtil) => {
  console.log(data);
  const data = {
    ...selfUser,
    phone_number: phoneUtil.format(phoneUtil.parse(`${selfUser.phone_number}`, 'KR'), PNF.E164)
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser }
  }
})

function Phone({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [selfUser, setSelfUser] = useState({
    ...prevSelfUser
  });
  const [selfUserError, setSelfUserError] = useState({
    phone_number: false,
  });

  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().getTime());
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const [timestampActivation, setTimestampActivation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timestampActivation) {
        if ((new Date().getTime() - timestamp) > constants.SIGNUP_PHONE_VERIFICATION_TIME_LIMIT) {
          setTimestampActivation(false);
          toast.error(i18n.t('_verificationCodeIsExpired'));
        }
      }
      setCurrentTimestamp(new Date().getTime());
    }, constants.TIMESTAMP_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  });

  return (
    <Layout
      locale={lng}
      menuItemList={prevSelfUser.menu_items}
      title={`${i18n.t('phoneNumber')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('phoneNumber')}
      />
      <Section
        title={i18n.t('phoneVerification')}
        titlePrefix={<IconButton><PhoneIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='phone_number'
            type='number'
            value={selfUser.phone_number}
            error={selfUserError.phone_number}
            fullWidth
            label={i18n.t('phoneNumber')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, phone_number: event.target.value }));
            }}
            required
          />
        </Box>
        <Box display={!timestampActivation ? 'block' : 'none'}>
          <Box marginY={1}>
            <Button
              color='default'
              fullWidth
              variant='contained'
              onClick={async () => {
                const phoneVerificationResponse = await postPhoneVerificationCode(selfUser);
                if (phoneVerificationResponse.status === 200) {
                  setTimestamp(new Date().getTime());
                  setTimestampActivation(true);
                  toast.success(i18n.t('_verificationCodeHasBeenSent'));
                }
                else {
                  toast.error(i18n.t('_errorOccurredProcessingRequest'));
                }
              }}
            >
              {i18n.t('getVerificationCode')}
            </Button>
          </Box>
        </Box>
        <Box display={timestampActivation ? 'block' : 'none'}>
          <Box paddingY={1}>
            <TextField
              name='verification_code'
              type='number'
              value={selfUser.verification_code}
              error={selfUserError.verification_code}
              fullWidth
              label={i18n.t('verificationCode')}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setSelfUser(prevSelfUser => ({ ...prevSelfUser, verification_code: event.target.value }));
              }}
              required
            />
          </Box>
          <Typography align='center' variant='subtitle1'>
            {`${i18n.t('_verificationCodeWillBeExpiredIn')}${Math.floor((constants.SIGNUP_PHONE_VERIFICATION_TIME_LIMIT - (currentTimestamp - timestamp)) / 1000)}${i18n.t('_localeDateTimeSecond')}`}
          </Typography>
        </Box>
      </Section>

        
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const putSelfUserResponse = await putSelfUser(selfUser, phoneUtil);
            if (postSelfUserResponse.status === 200) {
              router.push('/my-account/');
              toast.success(i18n.t('_myAccountSuccessfullyCreated'));
            }
            else if (postSelfUserResponse.status === 400) {
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, phone_number: !!postSelfUserResponse.data.phone_number}));
              toast.error(i18n.t('_checkInputFields'));
              console.log(postSelfUserResponse);
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Phone;
