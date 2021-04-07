import Head from "next/head";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BottomNavBar from './BottomNavBar'


export default function Layout({ bottomNav=true, children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container maxWidth="xs">
        <Box mb={bottomNav ? 7.5 : 0}>
          {children}
        </Box>
        {
          bottomNav && (
            <BottomNavBar />
          )
        }
      </Container>
    </>
  );
};
