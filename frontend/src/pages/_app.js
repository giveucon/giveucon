import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@material-ui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import I18n from 'lib/i18n'
import lightTheme from 'styles/lightTheme';
import darkTheme from 'styles/darkTheme';

function RootApp({ Component, pageProps }) {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(
    (pageProps.selfUser && pageProps.selfUser.dark_mode) ? darkTheme : lightTheme
  );
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    setTheme((pageProps.selfUser && pageProps.selfUser.dark_mode) ? darkTheme : lightTheme)
  });

  return (
    <>
      <Head>
        <title>_app.js is loading...</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
        />
      </Head>
      <I18n lngDict={pageProps.lngDict} locale={pageProps.lng}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Toaster 
            toastOptions={{
              className: null,
              style: {
                background: (pageProps.selfUser && pageProps.selfUser.dark_mode) ? 'black' : 'white',
                borderRadius: '1.5rem',
                color: (pageProps.selfUser && pageProps.selfUser.dark_mode) ? 'white' : 'black',
                margin: '1.2rem 0 0 0'
              },
            }}
          />
          <Backdrop style={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: 'transparent'}} open={pageLoading}>
            <LinearProgress style={{ position: 'absolute', top: '0', width: '100%' }} color='primary' />
          </Backdrop>
          <Component {...pageProps} />
        </ThemeProvider>
      </I18n>
    </>
  );
}

RootApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default RootApp;
