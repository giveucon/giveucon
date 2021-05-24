import React, { useEffect, useState } from 'react';
import { PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PhoneIcon from '@material-ui/icons/Phone';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withoutAuthServerSideProps from 'utils/withoutAuthServerSideProps'
import * as constants from '../../constants';

const getSelfAccount = async (context) => await requestToBackend(context, 'api/accounts/self/', 'get', 'json');

const postPhoneVerificationCode = async (selfUser, phoneUtil) => await requestToBackend(null, 'api/phone-verification-codes/', 'post', 'json', {
    phone_number: phoneUtil.format(phoneUtil.parse(`${selfUser.phone_number}`, 'KR'), PNF.E164)
  }, null);

const postSelfUser = async (selfUser, phoneUtil) => {
  const processedSelfUser = {
    ...selfUser,
    phone_number: phoneUtil.format(phoneUtil.parse(`${selfUser.phone_number}`, 'KR'), PNF.E164),
  }
  return await requestToBackend(null, 'api/users/', 'post', 'json', processedSelfUser, null);
};

export const getServerSideProps = withoutAuthServerSideProps(async (context, lng, lngDict) => {
  const selfAccountResponse = await getSelfAccount(context);
  if (selfAccountResponse.status === 403) {
    return {
      redirect: {
        permanent: false,
        destination: "/login/"
      }
    }
  }
  return {
    props: { lng, lngDict, selfAccount: selfAccountResponse.data }
  }
})

function Create({ lng, lngDict, selfAccount }) {

  const i18n = useI18n();
  const router = useRouter();
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [selfUser, setSelfUser] = useState({
    email: selfAccount.email,
    user_name: selfAccount.username,
    first_name: null,
    last_name: null,
    locale: lng,
    dark_mode: false,
    phone_number: null,
    verification_code: null,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
    phone_number: false,
    verification_code: false,
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
      lng={lng}
      lngDict={lngDict}
      menuItemList={null}
      title={`${i18n.t('createAccount')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('createAccount')}
       />
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='email'
            value={selfUser.email}
            error={selfUserError.email}
            fullWidth
            label={i18n.t('email')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, email: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='user_name'
            value={selfUser.user_name}
            error={selfUserError.user_name}
            fullWidth
            label={i18n.t('username')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, user_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='last_name'
            value={selfUser.last_name}
            error={selfUserError.last_name}
            fullWidth
            label={i18n.t('lastName')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, last_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <TextField
            name='first_name'
            value={selfUser.first_name}
            error={selfUserError.first_name}
            fullWidth
            label={i18n.t('firstName')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, first_name: event.target.value }));
            }}
            required
          />
        </Box>
        <Box paddingY={1}>
          <FormControl>
            <FormLabel>{i18n.t('language')}</FormLabel>
            <RadioGroup
              name='language'
              value={selfUser.locale}
              onChange={(event) => {
                i18n.locale('ko', constants.LANGUAGE_LIST.find(item => item.lng === event.target.value).lngDict);
                setSelfUser(prevSelfUser => ({  ...prevSelfUser, locale: event.target.value }));
              }}
            >
              <Grid container>
                {constants.LANGUAGE_LIST.map((item) => (
                  <Grid item xs={6}>
                    <FormControlLabel value={item.lng} control={<Radio />} label={item.name} />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box paddingY={1}>
          <FormGroup row>
            <FormControlLabel
            control={
              <Checkbox
                name='dark_mode'
                color='primary'
                checked={selfUser.dark_mode}
                onChange={(event) => {
                  setSelfUser(prevSelfUser => ({ ...prevSelfUser, dark_mode: event.target.checked }));
                }}
              />
            }
            label={i18n.t('darkMode')}
            />
          </FormGroup>
        </Box>
      </Section>


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
                const phoneVerificationResponse = await postPhoneVerificationCode(selfUser, phoneUtil);
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
            const postSelfUserResponse = await postSelfUser(selfUser, phoneUtil);
            if (postSelfUserResponse.status === 201) {
              router.push('/my-account/');
              toast.success(i18n.t('_myAccountSuccessfullyCreated'));
            }
            else if (postSelfUserResponse.status === 400) {
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, email: !!postSelfUserResponse.data.email}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, user_name: !!postSelfUserResponse.data.user_name}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, first_name: !!postSelfUserResponse.data.first_name}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, last_name: !!postSelfUserResponse.data.last_name}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, phone_number: !!postSelfUserResponse.data.phone_number}));
              toast.error(i18n.t('_checkInputFields'));
            }
          }}
        >
          {i18n.t('submit')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Create;
