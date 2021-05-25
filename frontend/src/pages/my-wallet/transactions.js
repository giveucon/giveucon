import React from 'react';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import TransactionListItem from 'components/TransactionListItem';
import useI18n from 'hooks/useI18n'
import request from 'utils/request'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getSelfBlockchainTransactionList = async (selfUser) => await request(
  {
    url: `https://blockstream.info/api/address/${selfUser.wallet}/txs`,
    method: 'get'
  }
);

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const getSelfBlockchainTransactionListResponse = await getSelfBlockchainTransactionList(selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfBlockchainTransactionList: getSelfBlockchainTransactionListResponse.data,
    }
  }
})

function Transactions({ lng, lngDict, selfUser, selfBlockchainTransactionList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myTransactions')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myTransactions')}
      >
        {selfBlockchainTransactionList && (selfBlockchainTransactionList.length > 0) ? (
          <Grid container spacing={1}>
            {selfBlockchainTransactionList.map((item) => (
              <Grid item xs={12}>
                <TransactionListItem
                  variant={item.vout.map(element => element.scriptpubkey_address).includes(selfUser.wallet) ? 'deposit' : 'withdraw'}
                  amount={item.vout.map(element => element.value).reduce((lhs, rhs) => lhs + rhs)}
                  fee={item.fee}
                  timestamp={item.status.block_time}
                  unit={i18n.t('_currencyBTC')}
                  onClick={() => router.push(`https://www.blockchain.com/${'btc'}/tx/${item.txid}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Transactions;
