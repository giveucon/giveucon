import Head from "next/head";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BottomNavBar from './BottomNavBar'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    maxWidth: "100%",
  },
  container: {
    position: "relative",
  },
}));

export default function Layout({ bottomNav=true, children, title }) {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container className={classes.container} maxWidth="xs">
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
