import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';

import HomeIcon from '@material-ui/icons/Home';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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
    ['홈', 'home', <HomeIcon />],
    ['버튼', '', <MoreIcon />],
    ['버튼', '', <MoreIcon />],
    ['버튼', '', <MoreIcon />],
    ['내 계정', 'myaccount', <AccountCircleIcon />]
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
          >
            {defaultActions}
          </BottomNavigation>
        </Container>
      </AppBar>
  );
}
