import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
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
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'
import * as constants from '../../../constants';

const putSelfUser = async (selfUser) => {
  const data = {
    ...selfUser,
    // menu_items: selfUser.menu_items
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: { lng, lngDict, selfUser }
  }))

function Locale({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    ...prevSelfUser,
    // menu_items: prevSelfUser.menu_items,
  });

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
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
                i18n.locale(event.target.value, constants.LANGUAGE_LIST.find(element => element.lng === event.target.value).lngDict);
                setSelfUser(prevSelfUser => ({ ...prevSelfUser, locale: event.target.value }));
              }}
            >
              <Grid container>
                {constants.LANGUAGE_LIST.map((item) => (
                  <Grid item xs={6} key={item.lng}>
                    <FormControlLabel value={item.lng} control={<Radio />} label={item.name} />
                  </Grid>
                ))}
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
                toast.success(i18n.t('_myAccountEdited'));
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
