import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import lightTheme from '../styles/lightTheme';
import darkTheme from '../styles/darkTheme';


function RootApp(props) {
  const { Component, pageProps } = props;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <NextAuthProvider session={pageProps.session}
        options={{ 
          clientMaxAge: 60,   // Re-fetch session if cache is older than 60 seconds
          keepAlive: 5 * 60   // Send keepAlive message every 5 minutes
        }}
      >
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
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
