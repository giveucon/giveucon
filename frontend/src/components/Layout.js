import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import BottomNavBar from 'components/BottomNavBar'

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    maxWidth: '100%',
  },
  childrenBox: {
    position: 'relative',
  },
}));

export default function Layout({
  menuItemList,
  children,
  title
}) {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Container maxWidth='xs'>
        <Box
          className={classes.childrenBox}
          marginBottom={menuItemList && (menuItemList.length > 0) ? 10 : 0}
        >
          {children}
        </Box>
        {
          menuItemList && (menuItemList.length > 0) && (
            <BottomNavBar menuItemList={menuItemList} />
          )
        }
      </Container>
    </>
  );
};
