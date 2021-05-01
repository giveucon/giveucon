import React from 'react'
import Head from 'next/head';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import BottomNavBar from 'components/BottomNavBar'

export default (Component, bottomNav=true) => {
  return (
    function({ ...props }) {
      return (
        <Box styles={{height: '100vh', maxWidth: '100%'}}>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
          </Head>
          <Container maxWidth='xs'>
            <Box marginBottom={bottomNav ? 10 : 0} style={{position: 'relative'}}>
              <Component {...props} />
            </Box>
            {
              bottomNav && (
                <BottomNavBar />
              )
            }
          </Container>
        </Box>
      )
    }
  )
}
