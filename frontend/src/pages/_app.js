import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@material-ui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import lightTheme from '../styles/lightTheme';
import darkTheme from '../styles/darkTheme';

function RootApp({ Component, pageProps }) {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? darkTheme : lightTheme;

  const [pageLoading, setPageLoading] = useState(false);

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
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
        />
      </Head>
      <NextAuthProvider
        session={pageProps.session}
        options={{ 
          clientMaxAge: 60,   // Re-fetch session if cache is older than 60 seconds
          keepAlive: 5 * 60   // Send keepAlive message every 5 minutes
        }}
      >
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
          <Component {...pageProps} />
        </ThemeProvider>
      </NextAuthProvider>
    </>
  );
}

RootApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default RootApp;
