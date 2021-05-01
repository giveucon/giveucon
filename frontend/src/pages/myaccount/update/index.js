import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout title={`${i18n.t('settings')} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title={i18n.t('settings')}
      >
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/myaccount/update/user/')}
          >
            {i18n.t('userSettings')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Index;
