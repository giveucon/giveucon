import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/use-i18n'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const { default: lngDict = {} } = await import(`locales/${context.query.lng}.json`);
  return {
    props: { lng: context.query.lng, lngDict, selfUser },
  };
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout title={`${i18n.t('pages.myaccount.update.index.pageTitle')} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={i18n.t('pages.myaccount.update.index.pageTitle')}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push(`/${lng}/myaccount/update/user/`)}
          >
            {i18n.t('pages.myaccount.update.index.userSettings')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Index;
