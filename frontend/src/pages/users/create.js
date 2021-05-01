import React, { useEffect, useState } from 'react';
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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import EN from 'locales/en.json'
import KO from 'locales/ko.json'
import getCookies from 'utils/getCookies'
import requestToBackend from 'utils/requestToBackend'
import setCookie from 'utils/setCookie'

const getSelfAccount = async (context) => {
  return await requestToBackend(context, 'api/accounts/self/', 'get', 'json');
};

const postSelfUser = async (selfUser) => {
  return await requestToBackend(null, 'api/users/', 'post', 'json', selfUser, null);
};

export async function getServerSideProps(context) {
  const selfAccountResponse = await getSelfAccount(context);
  return {
    props: { selfAccount: selfAccountResponse.data }
  };
}

function Create({ selfAccount, setDarkMode }) {

  const i18n = useI18n();
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    email: selfAccount.email,
    user_name: selfAccount.username,
    first_name: null,
    last_name: null,
    locale: 'ko',
    dark_mode: false,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
  });

  useEffect(() => {
    i18n.locale('ko', KO)
  }, [])

  return (
    <Layout title={`${i18n.t('createAccount')} - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title={i18n.t('createAccount')}
      >
      </Section>
      <Section
        title={i18n.t('basicInfo')}
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='email'
            value={selfUser.email}
            error={selfUserError.email}
            fullWidth
            label={i18n.t('.email')}
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
            <FormLabel>{i18n.t('locale')}</FormLabel>
            <RadioGroup
              name='locale'
              value={selfUser.locale}
              onChange={(event) => {
                event.target.value === 'en' && i18n.locale('en', EN);
                event.target.value === 'ko' && i18n.locale('ko', KO);
                setSelfUser(prevSelfUser => ({ ...prevSelfUser, locale: event.target.value }));
              }}
            >
              <Grid container>
                <Grid item xs={6}>
                  <FormControlLabel value='ko' control={<Radio />} label={i18n.t('_languageNameKorean')} />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel value='en' control={<Radio />} label={i18n.t('_languageNameEnglish')} />
                </Grid>
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
                  setDarkMode(event.target.checked);
                  setSelfUser(prevSelfUser => ({ ...prevSelfUser, dark_mode: event.target.checked }));
                }}
              />
            }
            label={i18n.t('darkMode')}
            />
          </FormGroup>
        </Box>
      </Section>
      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const response = await postSelfUser(selfUser);
            if (response.status === 201) {
              router.push('/myaccount/');
              toast.success(i18n.t('_myAccountSuccessfullyCreated'));
            }
            else if (response.status === 400) {
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, email: !!response.data.email}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, user_name: !!response.data.user_name}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, first_name: !!response.data.first_name}));
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, last_name: !!response.data.last_name}));
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
