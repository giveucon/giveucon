import React from 'react';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppsIcon from '@material-ui/icons/Apps';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import LanguageIcon from '@material-ui/icons/Language';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import StoreIcon from '@material-ui/icons/Store';

import Layout from 'components/Layout'
import ListItem from 'components/ListItem'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const toggleSelfUserDarkMode = async (selfUser) => {
  console.log(data);
  const data = {
    ...selfUser,
    dark_mode: !selfUser.dark_mode
  };
  return await requestToBackend(null, `/api/users/${selfUser.id}/`, 'put', 'json', data);
};

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
      />
      <Section
        title={i18n.t('userInfo')}
      >
        <ListItem
          variant='default'
          title={i18n.t('basicInfo')}
          icon={<AccountCircleIcon />}
          onClick={() => router.push('/my-account/update/basic/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('phoneNumber')}
          icon={<PhoneIcon />}
          onClick={() => router.push('/my-account/update/phone/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('location')}
          icon={<LocationOnIcon />}
          onClick={() => router.push('/my-account/update/location/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('seller')}
          icon={<StoreIcon />}
          onClick={() => router.push('/my-account/update/seller/')}
        />
      </Section>


      <Section
        title={i18n.t('personalization')}
      >
        <ListItem
          variant='default'
          title={i18n.t('menuItems')}
          icon={<AppsIcon />}
          onClick={() => router.push('/my-account/update/menu-items/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('locales')}
          icon={<LanguageIcon />}
          onClick={() => router.push('/my-account/update/locale/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('darkMode')}
          icon={<BrightnessMediumIcon />}
          suffix={
            <Switch
              checked={selfUser.dark_mode}
              color='primary'
              onChange={async () => {
                const response = await toggleSelfUserDarkMode(selfUser);
                if (response.status === 200) router.reload();
                else toast.error(i18n.t('_checkInputFields'));
              }}
            />
          }
        />
      </Section>
    </Layout>
  );
}

export default Index;
