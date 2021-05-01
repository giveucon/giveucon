import React from 'react';
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser },
  }
})

function Index({ lng, lngDict, selfUser }) {
  
  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout title={`거래 - ${i18n.t('_appName')}`}>
      <Section
        backButton
        title='거래'
      >
      </Section>
      <Section
        title='쿠폰 거래'
        titlePrefix={<IconButton><AttachMoneyIcon /></IconButton>}
        titleSuffix={<IconButton><ArrowForwardIcon /></IconButton>}
      >
        <AlertBox content='쿠폰 거래 서비스 준비중입니다.' variant='information' />
      </Section>
    </Layout>
  );
}

export default Index;
