import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import LanguageIcon from '@material-ui/icons/Language';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import EN from 'locales/en.json'
import KO from 'locales/ko.json'
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

const putSelfUser = async (selfUser) => {
  console.log(data);
  const data = {
    ...selfUser,
    // menu_items: selfUser.menu_items
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser }
  }
})

function Locale({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [selfUser, setSelfUser] = useState({
    ...prevSelfUser,
    // menu_items: prevSelfUser.menu_items,
  });
  const [selfUserError, setSelfUserError] = useState({
    email: false,
    user_name: false,
    first_name: false,
    last_name: false,
    phone_number: false,
  });

  return (
    <Layout
      locale={lng}
      menuItemList={prevSelfUser.menu_items}
      title={`${i18n.t('locale')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('locale')}
      />
      <Section
        title={i18n.t('locale')}
        titlePrefix={<IconButton><LanguageIcon /></IconButton>}
      >
        <Box padding={1}>
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
                  <FormControlLabel value='ko' control={<Radio />} label={i18n.t('_localeNameKorean')} />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel value='en' control={<Radio />} label={i18n.t('_localeNameEnglish')} />
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const response = await putSelfUser(selfUser);
              if (response.status === 200) {
                router.push('/my-account/update/');
                toast.success(i18n.t('_myAccountSuccessfullyEdited'));
              } 
              else if (response.status === 400) {
                toast.error(i18n.t('_checkInputFields'));
              }
            }}
          >
            {i18n.t('submit')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Locale;
