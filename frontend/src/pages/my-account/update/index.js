import React from 'react';
import { useRouter } from 'next/router'
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

import Layout from 'components/Layout'
import ListItem from 'components/ListItem'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser }
  }
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('settings')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('settings')}
      >
        <ListItem
          variant='default'
          prefix={<IconButton><AccountCircleIcon /></IconButton>}
          title={i18n.t('userSettings')}
          onClick={() => router.push('/my-account/update/user/')}
        />
        <Divider />
        <ListItem
          variant='default'
          prefix={<IconButton><MenuIcon /></IconButton>}
          title={i18n.t('menuItems')}
          onClick={() => router.push('/my-account/update/menu-items/')}
        />
      </Section>
    </Layout>
  );
}

export default Index;
