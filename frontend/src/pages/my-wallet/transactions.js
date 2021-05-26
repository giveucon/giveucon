import React from 'react';
import { useRouter } from 'next/router'
import { ResponsiveStream } from '@nivo/stream'
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import TransactionListItem from 'components/TransactionListItem';
import useI18n from 'hooks/useI18n'
import request from 'utils/request'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getSelfBlockchainAccount = async (selfUser) => await request(
  {
    url: `https://blockstream.info/api/address/${selfUser.wallet}`,
    method: 'get'
  }
);

const getSelfBlockchainTransactionList = async (selfUser) => await request({
  url: `https://blockstream.info/api/address/${selfUser.wallet}/txs`,
  method: 'get'
});

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const getSelfBlockchainAccountResponse = await getSelfBlockchainAccount(selfUser);
  const getSelfBlockchainTransactionListResponse = await getSelfBlockchainTransactionList(selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfBlockchainAccount: getSelfBlockchainAccountResponse.data,
      selfBlockchainTransactionList: getSelfBlockchainTransactionListResponse.data,
    }
  }
})

function Transactions({ lng, lngDict, selfUser, selfBlockchainAccount, selfBlockchainTransactionList }) {

  const i18n = useI18n();
  const router = useRouter();
  const depositWithdrawalData = [
    {vout: [{value: selfBlockchainAccount.chain_stats.funded_txo_sum - selfBlockchainAccount.chain_stats.spent_txo_sum}]},
    ...selfBlockchainTransactionList
  ].map((element, index) => {
    if (index === 0) return {
      vin: element.vin,
      vout: element.vout,
      variant: 'current',
      timestamp: null,
      fee: null
    };
    else return {
      vin: element.vin,
      vout: element.vout,
      variant: element.vout.map(lhs => lhs.scriptpubkey_address).includes(selfUser.wallet) ? 'deposit' : 'withdraw',
      timestamp: element.status.block_time,
      fee: element.fee
    }
  })
  .map(element => {
    if (element.variant === 'deposit') return {
      value: element.vout.find(lhs => lhs.scriptpubkey_address === selfUser.wallet).value,
      variant: element.variant,
      timestamp: element.timestamp,
      fee: element.fee
    };
    else if (element.variant === 'withdraw') return {
      value: element.vin.find(lhs => lhs.prevout.scriptpubkey_address === selfUser.wallet).prevout.value,
      variant: element.variant,
      timestamp: element.timestamp,
      fee: element.fee
    };
    else return {
      value: element.vout.reduce((lhs, rhs) => {return lhs.value + rhs.value}).value,
      variant: element.variant,
      timestamp: element.timestamp,
      fee: element.fee
    };
  });

  const balanceData = depositWithdrawalData.map((element, index, array) => {
    if (element.variant === 'current') return {value: element};
    else return {
      ...element,
      value: array.slice(0, index + 1).reduce((lhs, rhs) => {
        console.log(lhs);
        return rhs.variant === 'deposit' ? {value: lhs.value - rhs.value} : {value: lhs.value + rhs.value}
      })
    }
  }).map(element => element.value)
  .reverse();

  console.log(depositWithdrawalData);
  console.log(balanceData);


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

        <Box style={{height: 200}}>
          <ResponsiveStream
            data={balanceData}
            keys={[ 'value' ]}
            margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0
            }}
            axisLeft={null}
            enableGridY={true}
            offsetType="none"
            colors={{ scheme: 'accent' }}
          />
        </Box>

        {depositWithdrawalData && (depositWithdrawalData.length > 0) ? (
          <Grid container spacing={1}>
            {depositWithdrawalData.slice(-(depositWithdrawalData.length - 1)).map((item) => (
              <Grid item xs={12}>
                <TransactionListItem
                  variant={item.variant}
                  amount={item.value}
                  fee={item.fee}
                  timestamp={item.timestamp}
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