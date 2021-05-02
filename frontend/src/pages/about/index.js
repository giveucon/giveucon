import React from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import * as constants from '../../constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      locale={lng}
      menuItemValueList={selfUser.menuItems}
      title={`${i18n.t('about')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('about')}
      >
        <Box padding='2rem'>
          <Box style={{ position: 'relative', width: '100%', paddingBottom: '20%' }} >
            <Image
              src={constants.LOGO_PATH}
              layout='fill'
              objectFit='contain'
              alt={i18n.t('_appName')}
            />
          </Box>
        </Box>
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('https://github.com/giveucon/giveucon')}
          >
            {i18n.t('goToHomepage')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.back()}
          >
            {i18n.t('goBack')}
          </Button>
        </Box>
      </Section>
    </Layout>
  );
}

export default Index;
