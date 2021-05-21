import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import withoutAuthServerSideProps from 'utils/withoutAuthServerSideProps';

export const getStaticProps = withoutAuthServerSideProps (async (context, lng, lngDict) => {
  return {
    props: { lng, lngDict }
  }
})

function Offline({ lng, lngDict }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout title={`${i18n.t('offline')} - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title={i18n.t('offline')}
      >
        <AlertBox content={`${i18n.t('offline')}`} variant='error' />
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
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/')}
          >
            {i18n.t('goHome')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Offline;
