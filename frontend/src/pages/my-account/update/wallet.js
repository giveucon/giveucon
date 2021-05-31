import React, { useState } from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import Layout from 'components/Layout'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const putSelfUser = async (selfUser) => {
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', selfUser, null);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
  props: { lng, lngDict, selfUser }
}))

function Wallet({ lng, lngDict, selfUser: prevSelfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [selfUser, setSelfUser] = useState({
    ...prevSelfUser
  });
  const [selfUserError, setSelfUserError] = useState({
    wallet: false,
  });

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={prevSelfUser.menu_items}
      title={`${i18n.t('wallet')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('wallet')}
      />
      <Section
        title={i18n.t('walletAddress')}
        titlePrefix={<IconButton><AccountBalanceWalletIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='wallet'
            value={selfUser.wallet}
            error={selfUserError.wallet}
            fullWidth
            label={i18n.t('walletAddress')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setSelfUser(prevSelfUser => ({ ...prevSelfUser, wallet: event.target.value }));
            }}
            required
          />
        </Box>
      </Section>


      <Box marginY={1}>
        <Button
          color='primary'
          fullWidth
          variant='contained'
          onClick={async () => {
            const putSelfUserResponse = await putSelfUser(selfUser);
            if (putSelfUserResponse.status === 200) {
              router.push('/my-account/');
              toast.success(i18n.t('_myAccountEdited'));
            }
            else if (putSelfUserResponse.status === 400) {
              setSelfUserError(prevSelfUserError => ({...prevSelfUserError, wallet: !!putSelfUserResponse.data.wallet}));
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

export default Wallet;
