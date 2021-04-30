import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

import useI18n from 'hooks/use-i18n'
import withAuthServerSideProps from '../utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps(async (context, selfUser) => {
  const { default: lngDict = {} } = await import(`locales/${context.query.lng}.json`);
  return {
    props: { lng: context.query.lng, lngDict },
  };
})

function Index({ lng, lngDict }) {

  const i18n = useI18n();
  const router = useRouter();

  useEffect(() => {
    router.push(`/${lng}/home/`);
  }, [])

  return null;
}

export default Index;
