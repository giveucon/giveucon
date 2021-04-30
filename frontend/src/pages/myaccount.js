import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import useI18n from 'hooks/use-i18n'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  return {
    props: {},
  };
})

function MyAccount({ selfUser }) {

  const i18n = useI18n();
  const router = useRouter();

  useEffect(() => {
    router.push(`/${selfUser.locale}/myaccount/`);
  }, [])

  return null;
}

export default MyAccount;
