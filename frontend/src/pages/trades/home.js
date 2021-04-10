import React from 'react';
import axios from 'axios';
import { getSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import Layout from '../../components/Layout'
import Section from '../../components/Section'
import withAuthServerSideProps from '../withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  return {
    props: { session, selfUser },
  }
})

function Home({ session, selfUser }) {
  const router = useRouter();
  return (
    <>
      <Layout title={"거래 - " + process.env.NEXT_PUBLIC_APPLICATION_NAME}>
        <Section
          backButton
          title="거래"
        >
        </Section>
        <Section
          title="쿠폰 거래 서비스 준비중입니다."
          titlePrefix={<IconButton><AttachMoneyIcon /></IconButton>}
          titleSuffix={<><IconButton><ArrowForwardIcon /></IconButton></>}
        >
        </Section>
      </Layout>
    </>
  );
}

export default Home;
