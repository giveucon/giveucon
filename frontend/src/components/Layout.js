import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BottomNavBar from './BottomNavBar'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    maxWidth: '100%',
  },
  childrenBox: {
    position: 'relative',
  },
}));

export default function Layout({ bottomNav=true, children, title }) {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Container maxWidth='xs'>
        <Box className={classes.childrenBox} mb={bottomNav ? 10 : 0}>
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
