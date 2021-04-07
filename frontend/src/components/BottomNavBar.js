import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    top: 'auto',
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  bottomNavigation: {
    backgroundColor: theme.palette.background.default,
  },
}));


export default function BottomNavBar(props) {
  const router = useRouter();
  const classes = useStyles();
  let key = 0;
  const defaultActions = [
    ['홈', 'home', <HomeOutlinedIcon />],
    ['내 지갑', 'mywallet', <AccountBalanceWalletOutlinedIcon />],
    ['가게', 'stores', <StorefrontIcon />],
    ['거래', 'trades', <LocalMallOutlinedIcon />],
    ['내 계정', 'myaccount', <AccountCircleOutlinedIcon />]
  ].map(([label, value, icon]) => {
      return (
        <BottomNavigationAction
          key={++key}
          label={label}
          value={value}
          icon={icon}
          onClick={() => {router.push(`/${value}`)}}
        />
      )
  });
  return (
      <AppBar className={classes.appBar}>
        <Container maxWidth="xs">
          <BottomNavigation
            className={classes.bottomNavigation}
            value={router.pathname.split('/')[1] || 'home'}
            showLabels
          >
            {defaultActions}
          </BottomNavigation>
        </Container>
      </AppBar>
  );
}
