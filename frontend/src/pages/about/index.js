import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as constants from '../../constants';
import Layout from 'components/Layout';
import Section from 'components/Section';
import useI18n from 'hooks/useI18n';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser },
  };
})

function Index({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [count, setCount] = useState(1);

  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('about')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('about')}
      >
        {count < 10 && (
          <Box margin='2rem'>
            <Box style={{ position: 'relative', width: '100%', paddingTop: '20%' }} >
              <Image
                src={constants.LOGO_PATH}
                alt={i18n.t('_appName')}
                layout='fill'
                objectFit='contain'
                onClick={() => {
                  setCount(count => count + 1);
                }}
              />
            </Box>
          </Box>
        )}
        {count >= 10 && (
          <>
            <Box style={{ position: 'relative', width: '100%', paddingTop: '50%' }} >
              <Image
                src={'https://user-images.githubusercontent.com/48160211/114258807-29658d80-9a04-11eb-9d16-e69499a351a7.gif'}
                alt={i18n.t('_appName')}
                layout='fill'
                objectFit='contain'
              />
            </Box>
            <Typography align='center'>얼른 개발을 끝내고 싶은 개발자의 심정</Typography>
          </>
        )}
        <Typography align='center'>{`${i18n.t('version')}: ${constants.APP_VERSION}`}</Typography>
      </Section>
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
    </Layout>
  );
}

export default Index;
