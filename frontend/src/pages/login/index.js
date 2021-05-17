import React, { useState } from 'react';
import Image from 'next/image'
import Head from 'next/head';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LanguageIcon from '@material-ui/icons/Language';

import * as constants from '../../constants';
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import getCookies from 'utils/getCookies';
import setCookie from 'utils/setCookie';
import withoutAuthServerSideProps from 'utils/withoutAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  background: {
    height: '100vh',
    backgroundImage: 'url(https://cdn.pixabay.com/photo/2014/07/30/18/26/grocery-store-405522_960_720.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  kakaoButton: {
    background: theme.palette.kakao.main,
    color: theme.palette.kakao.contrastText,
    '&:hover': {
       background: theme.palette.kakao.dark,
    },
  },
}));

export const getServerSideProps = withoutAuthServerSideProps (async (context, lng, lngDict) => {
  const cookies = getCookies(context)
  if (cookies.giveucon_session) {
    return {
      redirect: { 
        permanent: false, 
        destination: '/home/'
      }
    }
  }
  return {
    props: { lng, lngDict }
  };
})

function Index( lng, lngDict ) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();
  const [language, setLanguage] = useState('ko');
  const [openLanguageMenu, setOpenLanguageMenu] = useState(false);

  return (
    <>
      <Head>
        <title>{`${i18n.t('login')} - ${i18n.t('_appName')}`}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Box
        className={classes.background}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Box style={{ minHeight: '8rem', minWidth: '16rem' }}>
          <Section
            title={i18n.t('welcome')}
          >
            <Box margin='2rem'>
              <Box style={{ position: 'relative', width: '100%', paddingTop: '35%' }} >
                <Image
                  src={constants.LOGO_PATH}
                  alt={i18n.t('_appName')}
                  layout='fill'
                  objectFit='contain'
                />
              </Box>
              <Typography align='center'>{`${i18n.t('version')}: ${constants.APP_VERSION}`}</Typography>
            </Box>

            <List disablePadding>
              <ListItem button onClick={() => setOpenLanguageMenu(!openLanguageMenu)}>
                <ListItemIcon><LanguageIcon /></ListItemIcon>
                <ListItemText primary={i18n.t('language')} />
                {openLanguageMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openLanguageMenu}>
                <List disablePadding>
                  {constants.LANGUAGE_LIST.map((item, index) => (
                    <>
                      <ListItem
                        key={item.lng}
                        button
                        selected={item.lng === language}
                        onClick={() => {
                          i18n.locale(item.lng, item.lngDict);
                          setLanguage(item.lng);
                        }}
                      >
                        <ListItemText primary={item.name} />
                      </ListItem>
                    </>
                  ))}
                </List>
              </Collapse>
            </List>

            <Box marginY={1}>
              <Button
                className={classes.kakaoButton}
                fullWidth
                variant='contained'
                onClick={() =>{
                  setCookie(context, 'giveucon_temp', JSON.stringify({lng: language}), {
                    maxAge: process.env.NEXT_PUBLIC_COOKIE_MAX_AGE,
                    path: process.env.NEXT_PUBLIC_COOKIE_PATH,
                  })
                  router.push('/oauth/kakao/login/')
                }}
              >
                {i18n.t('loginAsKakaoAccount')}
              </Button>
            </Box>
          </Section>
        </Box>
      </Box>
    </>
  );
}

export default Index;
