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
import lightTheme from '../styles/lightTheme';
import darkTheme from '../styles/darkTheme';
import getCookies from '../utils/getCookies';

function RootApp({ Component, pageProps }) {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const cookies = getCookies(null)
  const [theme, setTheme] = useState(
    cookies.giveucon && JSON.parse(cookies.giveucon).theme === 'dark' ? darkTheme : lightTheme
  );
  const [pageLoading, setPageLoading] = useState(false);

  const setDarkMode = (option) => {
    option === 'light' && setTheme(lightTheme);
    option === 'dark' && setTheme(darkTheme);
    option === 'auto' && (prefersDarkMode ? setTheme(darkTheme) : setTheme(lightTheme));
  }

  useEffect(() => {
    const handleStart = () => { setPageLoading(true); };
    const handleComplete = () => { setPageLoading(false); };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Toaster 
          toastOptions={{
            className: null,
            style: {
              borderRadius: '1.5rem'
            },
          }}
        />
        <Backdrop style={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: 'transparent'}} open={pageLoading}>
          <LinearProgress style={{ position: 'absolute', top: '0', width: '100%' }} color='primary' />
        </Backdrop>
        <Component {...pageProps} setDarkMode={setDarkMode} />
      </ThemeProvider>
    </>
  );
}

RootApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default RootApp;
