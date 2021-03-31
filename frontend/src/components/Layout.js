import Head from "next/head";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BottomNavBar from './BottomNavBar'


export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box mb={10}>
        <Container maxWidth="lg">
        {children}
        </Container>
      </Box>
      <BottomNavBar />
    </>
  );
};
